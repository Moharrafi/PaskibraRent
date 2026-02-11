const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Subscribe to newsletter
router.post('/', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // Updated to use database
        await pool.query(
            'INSERT INTO newsletter_subscribers (email) VALUES (?) ON DUPLICATE KEY UPDATE email = email',
            [email]
        );

        console.log(`New newsletter subscription (saved to DB): ${email}`);
        res.json({ message: 'Successfully subscribed to newsletter', email });
    } catch (err) {
        console.error('Newsletter subscription error:', err);
        res.status(500).json({ error: 'Failed to subscribe' });
    }
});

// Get all subscribers (Protected - Admin only ideally, but keeping simple for now as requested)
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC');
        res.json(rows);
    } catch (err) {
        console.error('Failed to fetch subscribers:', err);
        res.status(500).json({ error: 'Failed to fetch subscribers' });
    }
});



// Broadcast email (Protected - In a real app, add admin middleware)
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

router.post('/broadcast', async (req, res) => {
    const { subject, message, imageUrl } = req.body;

    if (!subject || !message) {
        return res.status(400).json({ error: 'Subject and message are required' });
    }

    try {
        const [subscribers] = await pool.query('SELECT email FROM newsletter_subscribers');

        if (subscribers.length === 0) {
            return res.json({ message: 'No subscribers to broadcast to.' });
        }

        const emailPromises = subscribers.map(sub => {
            let mailOptions = {
                from: `"KostumFadilyss Team" <${process.env.MAIL_USER}>`,
                to: sub.email,
                subject: subject,
                html: ''
            };

            let imageHtml = '';
            // Check if imageUrl is a Base64 string
            if (imageUrl && imageUrl.startsWith('data:image')) {
                const cid = 'broadcast-banner'; // Content-ID
                imageHtml = `<img src="cid:${cid}" alt="Newsletter Image" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 20px;">`;

                mailOptions.attachments = [{
                    path: imageUrl,
                    cid: cid
                }];
            } else if (imageUrl) {
                // Regular URL
                imageHtml = `<img src="${imageUrl}" alt="Newsletter Image" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 20px;">`;
            }

            mailOptions.html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${subject}</title>
                </head>
                <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                        
                        <!-- Header -->
                        <div style="background-color: #ffffff; padding: 24px 32px; border-bottom: 1px solid #f0f0f0; text-align: center;">
                            <h1 style="margin: 0; color: #dc2626; font-size: 24px; letter-spacing: -0.5px;">KostumFadilyss</h1>
                            <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Official Newsletter</p>
                        </div>

                        <!-- Hero Image -->
                        ${imageHtml ? `<div style="width: 100%; background-color: #f8fafc;">${imageHtml.replace('style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 20px;"', 'style="width: 100%; height: auto; display: block;"')}</div>` : ''}

                        <!-- Content -->
                        <div style="padding: 32px 32px 40px 32px;">
                            <h2 style="margin: 0 0 16px 0; color: #1e293b; font-size: 22px; line-height: 1.3;">${subject}</h2>
                            <div style="color: #475569; font-size: 16px; line-height: 1.7; white-space: pre-wrap;">${message}</div>
                            
                            <!-- Call to Action (Optional Button Placeholder for future use) -->
                            <!-- <div style="margin-top: 32px; text-align: center;">
                                <a href="https://paskibrarent.vercel.app" style="display: inline-block; background-color: #dc2626; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 50px; font-weight: 600; font-size: 14px;">Kunjungi Website</a>
                            </div> -->
                        </div>

                        <!-- Footer -->
                        <div style="background-color: #f8fafc; padding: 24px 32px; text-align: center; border-top: 1px solid #f0f0f0;">
                            <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                                &copy; ${new Date().getFullYear()} KostumFadilyss. All rights reserved.
                            </p>
                            <p style="margin: 8px 0 0 0; color: #cbd5e1; font-size: 11px;">
                                Anda menerima email ini karena berlangganan newsletter kami.
                                <br>
                                <a href="#" style="color: #94a3b8; text-decoration: underline;">Berhenti Berlangganan</a>
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `;

            return transporter.sendMail(mailOptions);
        });

        await Promise.all(emailPromises);

        console.log(`Broadcast sent to ${subscribers.length} subscribers.`);
        res.json({ message: `Broadcast sent successfully to ${subscribers.length} subscribers.` });

    } catch (err) {
        console.error('Broadcast failed:', err);
        res.status(500).json({ error: 'Failed to send broadcast', details: err.message });
    }
});

module.exports = router;
