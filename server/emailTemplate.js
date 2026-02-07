
const getVerificationEmailTemplate = (name, verificationLink) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verifikasi Akun PaskibraRent</title>
        <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
            .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
            .header { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 32px; text-align: center; }
            .header h1 { margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
            .content { padding: 40px 32px; color: #334155; line-height: 1.7; }
            .greeting { color: #1e293b; font-size: 22px; font-weight: 600; margin-bottom: 16px; margin-top: 0; }
            .message { margin-bottom: 24px; font-size: 16px; color: #475569; }
            .button-wrapper { text-align: center; margin: 32px 0; }
            .button { background-color: #dc2626; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; transition: background-color 0.2s; box-shadow: 0 4px 6px rgba(220, 38, 38, 0.2); }
            .button:hover { background-color: #b91c1c; }
            .link-text { font-size: 12px; color: #64748b; margin-top: 24px; word-break: break-all; text-align: center; }
            .footer { background-color: #f1f5f9; padding: 24px; text-align: center; font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
            .footer p { margin: 4px 0; }
        </style>
    </head>
    <body style="margin: 0; padding: 0;">
        <div style="padding: 24px;">
            <div class="container">
                <div class="header">
                    <h1>PaskibraRent</h1>
                </div>
                <div class="content">
                    <p class="greeting">Halo, ${name}!</p>
                    <p class="message">Selamat datang di <strong>PaskibraRent</strong>. Kami senang Anda bergabung bersama kami.</p>
                    <p class="message">Untuk mulai menyewa kostum dan mengakses semua fitur kami, mohon verifikasi alamat email Anda dengan mengklik tombol di bawah ini:</p>
                    
                    <div class="button-wrapper">
                        <a href="${verificationLink}" class="button" target="_blank">Verifikasi Akun Saya</a>
                    </div>
                    
                    <p class="message" style="margin-bottom: 0; font-size: 14px;">Tautan ini hanya berlaku selama <strong>24 jam</strong>.</p>
                    
                    <div class="link-text">
                        <p>Jika tombol tidak berfungsi, salin tautan ini ke browser Anda:</p>
                        <a href="${verificationLink}" style="color: #dc2626;">${verificationLink}</a>
                    </div>
                </div>
                <div class="footer">
                    <p>Email ini dikirim secara otomatis oleh sistem PaskibraRent.</p>
                    <p>&copy; ${new Date().getFullYear()} PaskibraRent. Hak cipta dilindungi.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = { getVerificationEmailTemplate };
