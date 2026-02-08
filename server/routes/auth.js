const router = require('express').Router();
const { getVerificationEmailTemplate } = require('../emailTemplate');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Create Transporter
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const [userExist] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (userExist.length > 0) {
            return res.status(401).json({ message: 'User already exists' });
        }

        // Hash password
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);

        // Generate Verification Token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Insert user (Unverified)
        let newUserId;
        try {
            const [result] = await pool.query(
                'INSERT INTO users (name, email, password, is_verified, verification_token) VALUES (?, ?, ?, ?, ?)',
                [name, email, bcryptPassword, false, verificationToken]
            );
            newUserId = result.insertId;
        } catch (insertError) {
            // Fallback for old schema if migration failed silently (should not happen but safe)
            if (insertError.code === 'ER_BAD_FIELD_ERROR') {
                console.warn('Using fallback registration (missing verification columns)');
                const [result] = await pool.query(
                    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                    [name, email, bcryptPassword]
                );
                newUserId = result.insertId;

                // If fallback is used, we cannot do email verification
                // Return success immediately without sending email
                return res.json({
                    message: 'Registrasi berhasil (Legacy Mode). Silakan login.',
                    warning: 'Verification skipped due to schema version.'
                });
            }
            throw insertError;
        }

        // Send Verification Email
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
        const verificationLink = `${clientUrl}?verify_token=${verificationToken}`;
        console.log('DEBUG: Generated Verification Link:', verificationLink);

        const mailOptions = {
            from: `"PaskibraRent Team" <${process.env.MAIL_USER}>`,
            to: email,
            subject: 'Verifikasi Akun PaskibraRent Anda',
            html: getVerificationEmailTemplate(name, verificationLink),
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (emailErr) {
            console.error('Email sending failed:', emailErr);
            // Rollback: Delete the user if email fails so they can try again
            if (newUserId) {
                await pool.query('DELETE FROM users WHERE id = ?', [newUserId]);
            }
            return res.status(500).json({ message: 'Gagal mengirim email verifikasi. Pastikan email Anda benar atau coba lagi nanti.' });
        }

        res.json({ message: 'Registrasi berhasil. Silakan cek email Anda untuk verifikasi.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Verify Email
router.post('/verify', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) return res.status(400).json({ message: 'Token tidak valid' });

        // Find user by token
        const [users] = await pool.query('SELECT * FROM users WHERE verification_token = ?', [token]);

        if (users.length === 0) {
            return res.status(400).json({ message: 'Token verifikasi tidak valid atau kedaluwarsa.' });
        }

        const user = users[0];

        // Update user to verified
        await pool.query('UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = ?', [user.id]);

        // Generate Login Token
        const jwtToken = jwt.sign({ user: { id: user.id, role: user.role } }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            token: jwtToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                created_at: user.created_at
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Verify Token (Get User)
// Add helpful message for GET request on login
router.get('/login', (req, res) => {
    res.status(405).json({ message: 'Method Not Allowed. Please use POST to login.' });
});

// Login
router.post('/login', async (req, res) => {
    console.log('[LOGIN START] Request received for:', req.body.email);
    try {
        const { email, password } = req.body;

        // Check JWT Secret
        if (!process.env.JWT_SECRET) {
            console.error('[LOGIN ERROR] JWT_SECRET is missing!');
            return res.status(500).json({ message: 'Server Configuration Error: JWT_SECRET missing' });
        }

        // Check if user exists
        console.log('[LOGIN STEP] Querying DB...');
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        console.log('[LOGIN STEP] DB Result:', users.length > 0 ? 'User Found' : 'User Not Found');

        if (users.length === 0) {
            return res.status(401).json({ message: 'Password or Email is incorrect' });
        }

        const user = users[0];

        // Check verification
        if (user.is_verified === 0) {
            return res.status(401).json({ message: 'Akun belum diverifikasi. Silakan cek email Anda.' });
        }

        // Check password
        console.log('[LOGIN STEP] Verifying password...');
        const validPassword = await bcrypt.compare(password, user.password);
        console.log('[LOGIN STEP] Password Valid:', validPassword);

        if (!validPassword) {
            return res.status(401).json({ message: 'Password or Email is incorrect' });
        }

        // Generate Token
        console.log('[LOGIN STEP] Signing JWT...');
        const token = jwt.sign({ user: { id: user.id, role: user.role } }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('[LOGIN SUCCESS] Token generated.');

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                created_at: user.created_at
            }
        });

    } catch (err) {
        console.error('[LOGIN CRASH]', err);
        res.status(500).json({ message: 'Server Logic Error', error: err.message, stack: err.stack });
    }
});

// Verify Token (Get User)
router.get('/me', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(403).json({ message: 'Not Authorized' });

        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const [users] = await pool.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [payload.user.id]);

        if (users.length === 0) return res.status(404).json({ message: 'User not found' });

        res.json(users[0]);
    } catch (err) {
        console.error(err.message);
        res.status(403).json({ message: 'Not Authorized' });
    }
});

module.exports = router;
