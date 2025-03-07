require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Doctor, Patient } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = parseInt(process.env.SALT) || 10;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
const phoneRegex = /^\d+$/;
const cnpRegex = /^\d{13}$/;

const registerUser = async (req, res) => {
    try {
        const { email, password, confirmPassword, role, phone_number, CNP, first_name, last_name, gender, address, specialty_id } = req.body;

        const token = req.cookies.token;
        let userRole = "patient"; 

        if (token) {
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                const adminUser = await User.findByPk(decoded.id);
                
                if (!adminUser || adminUser.role !== "admin") {
                    return res.status(403).json({ message: "Only an administrator can set roles!" });
                }

                if (role) {
                    userRole = role;
                }
            } catch (error) {
                return res.status(403).json({ message: "Invalid or expired token!" });
            }
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format!" });
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Password must have at least 8 characters, one uppercase letter, one lowercase letter, and one special character!" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match!" });
        }

        if (!["admin", "doctor", "patient"].includes(userRole)) {
            return res.status(400).json({ message: "Invalid role!" });
        }

        if (phone_number && !phoneRegex.test(phone_number)) {
            return res.status(400).json({ message: "Phone number must contain only digits!" });
        }

        if (userRole === "patient") {
            if (!CNP || !cnpRegex.test(CNP)) {
                return res.status(400).json({ message: "CNP must contain exactly 13 digits!" });
            }

            const existingCNP = await Patient.findOne({ where: { CNP } });
            if (existingCNP) {
                return res.status(400).json({ message: "CNP is already in use!" });
            }
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use!" });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = await User.create({ email, password: hashedPassword, role: userRole });

        if (userRole === "doctor") {
            if (!specialty_id) {
                return res.status(400).json({ message: "Specialty is required for doctors!" });
            }
            await Doctor.create({
                user_id: newUser.id,
                first_name,
                last_name,
                phone_number,
                specialty_id,
            });
        } else if (userRole === "patient") {
            if (!gender || !address) {
                return res.status(400).json({ message: "Gender and address are required for patients!" });
            }

            await Patient.create({
                user_id: newUser.id,
                first_name,
                last_name,
                CNP,
                gender,
                phone_number,
                address,
            });
        }

        res.status(201).json({ message: "User registered successfully!", user: newUser });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Error registering user!" });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Incorrect email or password!" });
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "24h" });
        res.cookie("token", token, { httpOnly: true, secure: false });

        res.status(200).json({ message: "Login successful!", token, user });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Error logging in!" });
    }
};

const logoutUser = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful!" });
};

const getCurrentUser = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized user!" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findByPk(decoded.id, { attributes: ["id", "email", "role"] });

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user!" });
    }
};

module.exports = { 
    registerUser, 
    loginUser, 
    logoutUser, 
    getCurrentUser 
};
