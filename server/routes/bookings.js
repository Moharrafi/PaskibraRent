const router = require('express').Router();
const nodemailer = require('nodemailer');
const APP_NAME = "PaskibraRent";

// Create Transporter
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

router.post('/', async (req, res) => {
    try {
        const { name, institution, phone, email, pickupDate, returnDate, rentalDuration, totalPrice, items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Keranjang belanja kosong' });
        }

        // Generate Booking ID
        const bookingId = `BOOK-${Date.now()}`;

        // 1. Email ke Customer (Konfirmasi)
        const customerMailOptions = {
            from: `"PaskibraRent Orders" <${process.env.MAIL_USER}>`,
            to: email, // Email pemesan
            subject: `[PaskibraRent] Konfirmasi Booking - ${bookingId}`,
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

        // 2. Email ke Admin (Notifikasi)
        const adminMailOptions = {
            from: `"System Notif" <${process.env.MAIL_USER}>`,
            to: 'mohamadarraafi@gmail.com', // Admin fixed email
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

        // Kirim keduanya
        await Promise.all([
            transporter.sendMail(customerMailOptions),
            transporter.sendMail(adminMailOptions)
        ]);

        res.json({ message: 'Booking berhasil dikirim', bookingId: bookingId });

    } catch (err) {
        console.error('Booking Error:', err);
        res.status(500).json({ message: 'Gagal memproses booking', error: err.message });
    }
});

module.exports = router;
