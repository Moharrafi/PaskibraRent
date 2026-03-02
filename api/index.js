let app;
try {
    app = require('../server/index');
} catch (e) {
    // If startup fails, return a JSON error with the details so we can debug
    app = (req, res) => {
        res.status(500).json({
            startup_error: e.message,
            stack: e.stack,
            code: e.code
        });
    };
}

module.exports = app;
