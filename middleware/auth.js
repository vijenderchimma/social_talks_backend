// middleware/auth.js

const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv')

module.exports = (req, res, next) => {
    // Get token from header
    const token = req.header('authToken');

    // Check if not token
    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.WHATISYOURNAME);
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};

