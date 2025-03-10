const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const checkAuth = async (req, res, next) => {
    try {
        let token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized! You must be authenticated." });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token invalid or expired." });
    }
};

const checkPermission = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Acces denied!" });
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

const checkSelfOrDoctorOrAdmin = (req, res, next) => {
    if (req.user.role === "admin" || req.user.role === "doctor" || req.user.id === req.params.id) {
        return next();
    }
    return res.status(403).json({ message: "Access denied!" });
};

module.exports = { checkAuth, checkPermission, checkSelfOrAdmin, checkSelfOrDoctorOrAdmin };
