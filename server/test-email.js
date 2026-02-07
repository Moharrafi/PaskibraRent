
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

async function verify() {
    console.log(`Testing connection for ${process.env.MAIL_USER}...`);
    try {
        await transporter.verify();
        console.log('✅ Connection SUCCESS!');
    } catch (error) {
        console.error('❌ Connection FAILED:', error.message);
        if (error.responseCode === 535) {
            console.error('👉 Cause: Invalid App Password or Username.');
        }
    }
}

verify();
