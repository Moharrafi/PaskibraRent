const router = require('express').Router();
const nodemailer = require('nodemailer');
const { pool } = require('../db');
const jwt = require('jsonwebtoken');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const APP_NAME = "KostumFadilyss";

// Create Transporter
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

// GET User Bookings
router.get('/my-bookings', verifyToken, async (req, res) => {
    try {
        const userId = req.user.user.id;

        // 1. Get Bookings
        const [bookings] = await pool.query(
            'SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );

        // 2. Get Items for each booking
        const bookingsWithItems = await Promise.all(bookings.map(async (booking) => {
            const [items] = await pool.query(
                'SELECT * FROM booking_items WHERE booking_id = ?',
                [booking.id]
            );

            // Check status logic: if returnDate < today and status is 'Sedang Disewa', make it 'Selesai'
            // DB Date is usually YYYY-MM-DD.
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const returnDate = new Date(booking.return_date);

            let status = booking.status;
            if (status === 'Sedang Disewa' && returnDate < today) {
                status = 'Selesai';
                // Optionally update DB lazily
                await pool.query('UPDATE bookings SET status = ? WHERE id = ?', ['Selesai', booking.id]);
            }

            return {
                ...booking,
                status,
                items
            };
        }));

        res.json(bookingsWithItems);
    } catch (err) {
        console.error('Error fetching bookings:', err);
        res.status(500).json({ message: 'Gagal mengambil riwayat booking' });
    }
});

// GET All Bookings (Admin)
router.get('/all', verifyAdmin, async (req, res) => {
    try {
        // In a real app, check for admin role here: if (req.user.role !== 'admin') ...

        // 1. Get All Bookings
        const [bookings] = await pool.query(
            'SELECT * FROM bookings ORDER BY created_at DESC'
        );

        // 2. Get Items for each booking
        const bookingsWithItems = await Promise.all(bookings.map(async (booking) => {
            const [items] = await pool.query(
                'SELECT * FROM booking_items WHERE booking_id = ?',
                [booking.id]
            );

            // Check status logic (same as my-bookings)
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const returnDate = new Date(booking.return_date);

            let status = booking.status;
            if (status === 'Sedang Disewa' && returnDate < today) {
                status = 'Selesai';
                await pool.query('UPDATE bookings SET status = ? WHERE id = ?', ['Selesai', booking.id]);
            }

            return {
                ...booking,
                status,
                items
            };
        }));

        res.json(bookingsWithItems);
    } catch (err) {
        console.error('Error fetching all bookings:', err);
        res.status(500).json({ message: 'Gagal mengambil data booking' });
    }
});

// GET Availability Status
router.get('/availability', async (req, res) => {
    try {
        // Use application server time (Local/User System) instead of DB server time (UTC)
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;

        const query = `
            SELECT bi.item_id, SUM(bi.item_qty) as booked_qty
            FROM booking_items bi
            JOIN bookings b ON bi.booking_id = b.id
            WHERE 
                b.status IN ('Menunggu', 'Konfirmasi', 'Sedang Disewa') AND
                (
                    (DATE_SUB(b.pickup_date, INTERVAL 5 DAY) <= ? AND b.return_date >= ?)
                )
            GROUP BY bi.item_id
        `;

        const [rows] = await pool.query(query, [todayStr, todayStr]);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching availability:', err);
        res.status(500).json({ message: 'Gagal mengambil data ketersediaan' });
    }
});

router.post('/', verifyToken, async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { name, institution, phone, email, pickupDate, returnDate, rentalDuration, totalPrice, items } = req.body;

        // Auth check (Optional based on rules, but we need user_id)
        const authHeader = req.headers['authorization'];
        let userId = null;

        if (authHeader) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.user.id;
            } catch (e) {
                console.warn('Invalid token for booking');
            }
        }

        if (!userId) {
            // If we require login for booking
            return res.status(401).json({ message: 'Silakan login untuk melakukan pemesanan.' });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Keranjang belanja kosong' });
        }

        // Generate Booking ID
        const bookingId = `TRX-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`;

        // 1. Insert into Bookings
        await connection.query(
            `INSERT INTO bookings 
            (id, user_id, total_price, status, pickup_date, return_date, rental_duration, customer_name, customer_institution, customer_phone, customer_email) 
            VALUES (?, ?, ?, 'Menunggu', ?, ?, ?, ?, ?, ?, ?)`,
            [bookingId, userId, totalPrice, pickupDate, returnDate, rentalDuration, name, institution, phone, email]
        );

        // 2. Insert Items
        for (const item of items) {
            await connection.query(
                `INSERT INTO booking_items (booking_id, item_id, item_name, item_qty, item_price, item_category, item_image) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [bookingId, item.id, item.name, item.quantity, item.price, item.category || 'general', item.image]
            );
        }

        // Clear user's cart after successful booking
        await connection.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

        await connection.commit();

        // 3. Send Emails (Async - don't block response) (Kept original logic)
        const customerMailOptions = {
            from: `"KostumFadilyss Orders" <${process.env.MAIL_USER}>`,
            to: email, // Email pemesan
            subject: `[KostumFadilyss] Konfirmasi Booking - ${bookingId}`,
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #334155; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
                    .header { background: #0f172a; padding: 32px; text-align: center; }
                    .header h1 { color: #f8fafc; margin: 0; font-size: 24px; letter-spacing: 1px; }
                    .content { padding: 40px 32px; }
                    .section-title { font-size: 14px; text-transform: uppercase; letter-spacing: 1.2px; font-weight: 700; color: #94a3b8; margin-bottom: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 32px; }
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
                    .info-item label { display: block; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; margin-bottom: 4px; }
                    .info-item p { margin: 0; font-weight: 600; color: #0f172a; font-size: 14px; }
                    .table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
                    .table th { text-align: left; font-size: 12px; color: #64748b; padding: 12px 8px; border-bottom: 2px solid #e2e8f0; }
                    .table td { padding: 12px 8px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
                    .total-row td { border-top: 2px solid #0f172a; font-weight: 700; color: #0f172a; font-size: 16px; padding-top: 16px; }
                    .footer { background: #f1f5f9; padding: 24px; text-align: center; font-size: 12px; color: #64748b; }
                    .status-badge { display: inline-block; padding: 6px 16px; background: #dcfce7; color: #166534; border-radius: 9999px; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; }
                    .id-badge { display: inline-block; margin-top: 12px; padding: 4px 12px; background: #f1f5f9; color: #64748b; border-radius: 6px; font-family: monospace; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>${APP_NAME}</h1>
                        <p style="color: #94a3b8; font-size: 14px; margin-top: 8px;">Konfirmasi Pesanan</p>
                    </div>
                    <div class="content">
                        <div style="text-align: center; margin-bottom: 40px;">
                            <span class="status-badge">MENUNGGU KONFIRMASI</span><br>
                            <span class="id-badge">ID: ${bookingId}</span>
                            <h2 style="margin: 24px 0 8px; color: #0f172a;">Terima Kasih, ${name}</h2>
                            <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.6;">Permintaan booking Anda telah kami terima.<br>Admin kami akan segera mengecek ketersediaan barang.</p>
                        </div>
                        
                        <div class="section-title">Informasi Pemesan</div>
                        <div class="info-grid">
                            <div class="info-item"><label>Nama Lengkap</label><p>${name}</p></div>
                            <div class="info-item"><label>Instansi</label><p>${institution}</p></div>
                            <div class="info-item"><label>WhatsApp</label><p>${phone}</p></div>
                            <div class="info-item"><label>Email</label><p>${email}</p></div>
                        </div>

                        <div class="section-title">Detail Sewa</div>
                        <div class="info-grid">
                            <div class="info-item"><label>Tgl Pengambilan</label><p>${pickupDate}</p></div>
                            <div class="info-item"><label>Tgl Pengembalian</label><p>${returnDate}</p></div>
                            <div class="info-item"><label>Durasi</label><p>${rentalDuration} Hari</p></div>
                        </div>

                        <div class="section-title">Rincian Barang</div>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th style="text-align: center;">Qty</th>
                                    <th style="text-align: right;">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${items.map(item => `
                                    <tr>
                                        <td>
                                            <div style="font-weight: 600; color: #0f172a;">${item.name}</div>
                                            <div style="font-size: 12px; color: #64748b;">@ Rp ${parseInt(item.price).toLocaleString('id-ID')}</div>
                                        </td>
                                        <td style="text-align: center;">${item.quantity}</td>
                                        <td style="text-align: right; font-weight: 600;">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</td>
                                    </tr>
                                `).join('')}
                                <tr class="total-row">
                                    <td colspan="2">Total Estimasi</td>
                                    <td style="text-align: right;">Rp ${totalPrice.toLocaleString('id-ID')}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 12px; padding: 20px; font-size: 14px; color: #9f1239; line-height: 1.6;">
                            <strong>📢 Langkah Selanjutnya:</strong><br>
                            Silakan tunggu konfirmasi ketersediaan dari admin. Kami akan menghubungi Anda via WhatsApp di nomor <strong>${phone}</strong> untuk konfirmasi final dan informasi pembayaran DP.
                        </div>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            `
        };

        const adminMailOptions = {
            from: `"System Notif" <${process.env.MAIL_USER}>`,
            to: 'mohamadfadilah426@gmail.com', // Admin fixed email mohamadfadilah426@gmail.com
            subject: `[ADMIN] Booking Baru #${bookingId} - ${name}`,
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
                    .header { background: #1e293b; padding: 24px; text-align: center; color: white; }
                    .content { padding: 40px; }
                    .alert-badge { background: #fee2e2; color: #991b1b; padding: 8px 16px; border-radius: 99px; font-weight: bold; font-size: 12px; display: inline-block; margin-bottom: 20px; letter-spacing: 1px; }
                    .booking-id { color: #64748b; font-family: monospace; margin-bottom: 4px; font-size: 14px; }
                    .info-group { margin-bottom: 24px; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; }
                    .label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 6px; }
                    .value { font-size: 15px; color: #0f172a; font-weight: 600; }
                    .table { width: 100%; border-collapse: collapse; margin-top: 24px; }
                    .table th { text-align: left; font-size: 11px; color: #64748b; border-bottom: 2px solid #e2e8f0; padding: 12px 8px; letter-spacing: 0.5px; }
                    .table td { padding: 16px 8px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; }
                    .price { font-weight: 600; text-align: right; }
                    .total-section { background: #f8fafc; padding: 20px; border-radius: 12px; margin-top: 24px; text-align: right; border: 1px solid #e2e8f0; }
                    .total-label { font-size: 13px; color: #64748b; margin-bottom: 4px; }
                    .total-value { font-size: 24px; font-weight: 800; color: #0f172a; }
                    .actions { margin-top: 32px; width: 100%; }
                    .btn { display: block; text-align: center; padding: 14px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px; transition: opacity 0.2s; }
                    .btn:hover { opacity: 0.9; }
                    .btn-wa { background: #22c55e; color: white; box-shadow: 0 4px 6px -1px rgba(34, 197, 94, 0.2); }
                    .btn-email { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2 style="margin:0; font-size: 18px; font-weight: 500; opacity: 0.9;">Panel Notifikasi Admin</h2>
                    </div>
                    <div class="content">
                        <div style="text-align: center; margin-bottom: 32px;">
                            <div class="alert-badge">BOOKING BARU</div>
                            <div class="booking-id">#${bookingId}</div>
                            <h1 style="margin: 4px 0 8px; font-size: 28px; color: #0f172a;">${name}</h1>
                            <p style="margin: 0; color: #64748b; font-size: 16px;">${institution}</p>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div class="info-group">
                                <div class="label">Tanggal Ambil</div>
                                <div class="value">${pickupDate}</div>
                            </div>
                            <div class="info-group">
                                <div class="label">Tanggal Kembali</div>
                                <div class="value">${returnDate}</div>
                            </div>
                        </div>

                        <div class="info-group" style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <div class="label">Kontak WhatsApp</div>
                                <div class="value">${phone}</div>
                            </div>
                            <div>
                                <div class="label" style="text-align: right;">Email</div>
                                <div class="value" style="text-align: right;">${email}</div>
                            </div>
                        </div>

                        <div class="label" style="margin-top: 12px; margin-left: 8px;">Rincian Item Sewa</div>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>BARANG</th>
                                    <th style="text-align: center;">QTY</th>
                                    <th style="text-align: right;">TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${items.map(item => `
                                    <tr>
                                        <td>
                                            <div style="font-weight: 600; color: #0f172a;">${item.name}</div>
                                            <div style="font-size: 12px; color: #94a3b8;">${item.category === 'fullset' ? 'Full Set' : 'Aksesoris'}</div>
                                        </td>
                                        <td style="text-align: center; font-weight: 600;">${item.quantity}</td>
                                        <td class="price">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>

                        <div class="total-section">
                            <div class="total-label">Total Estimasi Pendapatan</div>
                            <div class="total-value">Rp ${totalPrice.toLocaleString('id-ID')}</div>
                        </div>

                        <table class="actions" width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                                <td width="50%" align="right" style="padding-right:8px; vertical-align: left;">
                                    <a href="https://wa.me/${phone}?text=Halo%20${name},%20saya%20Admin%20${APP_NAME}.%20Terima%20kasih%20telah%20melakukan%20booking.%20Kami%20telah%20menerima%20rincian%20pesanan%20Anda%20dan%20akan%20segera%20kami%20proses%20untuk%20pengecekan%20ketersediaan%20stok.%20Mohon%20ditunggu%20konfirmasinya." class="btn btn-wa" style="display: inline-block; width: auto; padding: 12px 24px;">
                                        <img src="https://img.icons8.com/color/48/whatsapp--v1.png" alt="WhatsApp" width="20" height="20" style="vertical-align: middle; margin-right: 8px;"> Follow-up
                                    </a>
                                </td>
                                <td width="50%" align="left" style="padding-left: 8px; vertical-align: left;">
                                    <a href="mailto:${email}?subject=Konfirmasi%20Booking%20${APP_NAME}%20-%20#${bookingId}" class="btn btn-email" style="display: inline-block; width: auto; padding: 12px 24px;">
                                        <img src="https://img.icons8.com/color/48/gmail-new.png" alt="Email" width="20" height="20" style="vertical-align: middle; margin-right: 8px;"> Kirim Email
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </body>
            </html>
            `
        };

        transporter.sendMail(customerMailOptions).catch(console.error);
        transporter.sendMail(adminMailOptions).catch(console.error);

        res.json({ message: 'Booking berhasil dikirim', bookingId: bookingId });

    } catch (err) {
        await connection.rollback();
        console.error('Booking Error:', err);
        res.status(500).json({ message: 'Gagal memproses booking', error: err.message });
    } finally {
        connection.release();
    }
});

// GET Revenue Stats
router.get('/stats/revenue', verifyAdmin, async (req, res) => {
    try {
        const year = req.query.year || new Date().getFullYear();

        // Query to get monthly revenue and count for the specified year
        // We filter by 'Selesai', 'Sedang Disewa', 'Konfirmasi' (Approved bookings)
        // Adjust status filter as needed based on what counts as "revenue"
        const query = `
            SELECT 
                MONTH(pickup_date) as month, 
                COUNT(*) as rental_count, 
                SUM(total_price) as total_revenue
            FROM bookings 
            WHERE 
                YEAR(pickup_date) = ? AND 
                status IN ('Selesai', 'Sedang Disewa', 'Konfirmasi', 'Menunggu') 
            GROUP BY MONTH(pickup_date)
            ORDER BY month ASC
        `;

        const [rows] = await pool.query(query, [year]);

        // Format data for all 12 months (0-fill missing months)
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const stats = monthNames.map((name, index) => {
            const monthData = rows.find(r => r.month === (index + 1));
            return {
                name: name,
                rentals: monthData ? monthData.rental_count : 0,
                revenue: monthData ? Number(monthData.total_revenue) : 0
            };
        });

        res.json(stats);
    } catch (err) {
        console.error('Error fetching revenue stats:', err);
        res.status(500).json({ message: 'Gagal mengambil statistik pendapatan' });
    }
});

module.exports = router;
