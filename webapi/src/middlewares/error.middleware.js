const service = require('../services/log.service');

function middleware (err, req, res, next) {
    const statusCode = err.statusCode || 500;
    
    req.internalError = err.message;

    res.status(statusCode).json({ 'message': err.message });

    return;
}

module.exports = middleware;