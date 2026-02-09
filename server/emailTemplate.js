
const getVerificationEmailTemplate = (name, verificationLink, clientUrl = 'https://paskibrarent.vercel.app') => {
    // Force use production URL for images to ensure they load in email clients
    const logoUrl = 'https://paskibrarent.vercel.app/images/logo.png';

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verifikasi Akun KostumFadilyss</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; line-height: 1.6; color: #1f2937; }
            .container { max-width: 500px; margin: 60px auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); overflow: hidden; border: 1px solid #f3f4f6; }
            .header { padding: 40px 0 24px; text-align: center; background-color: #ffffff; }
            .branding { display: inline-flex; align-items: center; justify-content: center; gap: 12px; }
            .logo { height: 40px; width: auto; display: block; }
            .title { margin: 0; color: #ef4444; font-size: 24px; font-weight: 800; letter-spacing: -0.025em; line-height: 1; }
            .content { padding: 0 48px 48px; text-align: center; }
            .greeting { color: #111827; font-size: 20px; font-weight: 700; margin-bottom: 16px; }
            .message { margin-bottom: 32px; font-size: 16px; color: #6b7280; line-height: 1.6; }
            .button { background-color: #ef4444; color: #ffffff !important; text-decoration: none; padding: 14px 36px; border-radius: 9999px; font-weight: 600; font-size: 15px; display: inline-block; transition: all 0.2s; border: 2px solid #ef4444; }
            .button:hover { background-color: #ffffff; color: #ef4444 !important; }
            .warning { background-color: #fef2f2; color: #b91c1c; padding: 12px; border-radius: 8px; font-size: 13px; margin: 32px 0 0; display: inline-block; }
            .link-text { margin-top: 32px; font-size: 12px; color: #9ca3af; word-break: break-all; }
            .link-text a { color: #ef4444; text-decoration: none; font-weight: 500; }
            .footer { padding: 32px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; background-color: #f9fafb; }
            
            /* Email client compatibility for flexbox */
            @media only screen and (max-width: 600px) {
                .container { margin: 20px; width: auto; border-radius: 12px; }
                .content { padding: 0 24px 32px; }
            }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f9fafb;">
        <div style="padding: 24px 0;">
            <div class="container">
                <div class="header">
                    <!-- Table for better email client support on alignment -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td align="center">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding-right: 12px;">
                                            <img src="${logoUrl}" alt="Logo" class="logo" width="40" height="40" style="display: block; width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">
                                        </td>
                                        <td>
                                            <h1 class="title">KostumFadilyss</h1>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="content">
                    <p class="greeting">Halo, ${name}</p>
                    <p class="message">Selamat datang! Langkah terakhir untuk mengamankan akun Anda adalah memverifikasi alamat email ini.</p>
                    
                    <a href="${verificationLink}" class="button" target="_blank">Verifikasi Sekarang</a>
                    
                    <div class="warning">
                        Tautan ini akan kedaluwarsa dalam 24 jam.
                    </div>
                </div>
                <div class="footer">
                    <p>Jika tombol tidak berfungsi, salin tautan ini:</p>
                    <div class="link-text" style="margin-top: 8px;">
                        <a href="${verificationLink}">${verificationLink}</a>
                    </div>
                    <p style="margin-top: 24px; color: #d1d5db;">&copy; ${new Date().getFullYear()} KostumFadilyss Inc.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = { getVerificationEmailTemplate };

