const jwt = require('jsonwebtoken');

exports.authorization = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(403).json({message: "not authorized"});
    }
    try {
        const tokenPayload = jwt.verify(token, process.env.TOKENKEY);
        req.userId = tokenPayload.userId;
        return next();
    } catch {
        return res.status(403).json({message: "not authorized"});
    }
}