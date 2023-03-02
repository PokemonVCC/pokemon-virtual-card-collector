const jwt = require('jsonwebtoken');
const authConfig = require('../configs/auth.config');

function middleware (req, res, next) {
    const token = req.headers['x-access-token'];

    if(!token) {
        res.status(403);
        res.json({ message: 'Missing token' });
        return;
    }

    try {
        const decoded = jwt.verify(token, authConfig.tokenKey);
        req.authenticatedUser = decoded;
    }
    catch {
        res.status(401);
        res.json({ message: 'Invalid token' });
        return;
    }

    return next();
};

module.exports = middleware;