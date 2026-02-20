const jwt = require('jsonwebtoken');

// Middleware to verify a valid token for logged-in users
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak. Silakan login.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token tidak valid atau telah kedaluwarsa.' });
        }
        req.user = decoded; // Set the decoded payload to req.user
        next();
    });
};

// Middleware to verify if the logged-in user is an admin
const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak. Silakan login.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token tidak valid atau telah kedaluwarsa.' });
        }

        // Specifically check for admin role
        if (decoded.user && decoded.user.role === 'admin') {
            req.user = decoded;
            next();
        } else {
            return res.status(403).json({ message: 'Akses ditolak. Hanya Admin yang diizinkan.' });
        }
    });
};

module.exports = {
    verifyToken,
    verifyAdmin
};
