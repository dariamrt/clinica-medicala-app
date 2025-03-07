const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT;

const checkAuth = async (req, res, next) => {
    try {
        let token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Neautorizat! Trebuie să fii autentificat." });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token invalid sau expirat." });
    }
};

const checkPermission = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Acces interzis!" });
        }
        next();
    };
};

const checkSelfOrAdmin = (req, res, next) => {
    if (req.user.role === "admin" || req.user.id === req.params.id) {
        return next();
    }
    return res.status(403).json({ message: "Access denied!" });
};

module.exports = { checkAuth, checkPermission, checkSelfOrAdmin };
