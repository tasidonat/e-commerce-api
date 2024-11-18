const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if(!token) {
        return res.status(401).json({ message: 'Access denied. No token provided' });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;

        next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
};

exports.adminOnly = (req, res, next) => {
    if(req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied!' })
    }

    next();
}