const { User, Doctor, Patient } = require("../models");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ["id", "email", "role"],
            include: [
                {
                    model: Doctor,
                    attributes: ["first_name", "last_name", "specialty_id"],
                    required: false,
                    as: "Doctors_Datum"
                },
                {
                    model: Patient,
                    attributes: ["first_name", "last_name", "CNP", "gender"],
                    required: false,
                    as: "Patients_Datum"
                }
            ],
        });

        const filteredUsers = users.map(user => {
            let userData = {
                id: user.id,
                email: user.email,
                role: user.role,
            };

            if (user.role === "doctor" && user.Doctors_Datum) {
                userData = { ...userData, ...user.Doctors_Datum.get() };
            } else if (user.role === "patient" && user.Patients_Datum) {
                userData = { ...userData, ...user.Patients_Datum.get() };
            }

            return userData;
        });

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users!" });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
            return res.status(400).json({ message: "Invalid ID format!" });
        }

        const user = await User.findByPk(id, {
            attributes: ["id", "email", "role"],
            include: [
                {
                    model: Doctor,
                    attributes: ["first_name", "last_name", "specialty_id"],
                    required: false,
                    as: "Doctors_Datum"
                },
                {
                    model: Patient,
                    attributes: ["first_name", "last_name", "CNP", "gender"],
                    required: false,
                    as: "Patients_Datum"
                }
            ],
        });

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        let userData = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        if (user.role === "doctor" && user.Doctors_Datum) {
            userData = { ...userData, ...user.Doctors_Datum.get() };
        } else if (user.role === "patient" && user.Patients_Datum) {
            userData = { ...userData, ...user.Patients_Datum.get() };
        }

        res.status(200).json(userData);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user!" });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password, confirmPassword, phone_number, CNP, first_name, last_name, gender, address, specialty_id } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: "Invalid email format!" });
        }

        if (password) {
            if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/.test(password)) {
                return res.status(400).json({ message: "Password must have at least 8 characters, one uppercase letter, one lowercase letter, and one special character!" });
            }
            if (password !== confirmPassword) {
                return res.status(400).json({ message: "Passwords do not match!" });
            }
            user.password = await bcrypt.hash(password, 10);
        }

        if (phone_number && !/^\d+$/.test(phone_number)) {
            return res.status(400).json({ message: "Phone number must contain only digits!" });
        }

        if (CNP && !/^\d{13}$/.test(CNP)) {
            return res.status(400).json({ message: "CNP must have exactly 13 digits!" });
        }

        if (email) user.email = email;
        await user.save();

        if (user.role === "doctor") {
            let doctorProfile = await Doctor.findOne({ where: { user_id: id } });
            if (!doctorProfile) {
                return res.status(400).json({ message: "Doctor profile does not exist!" });
            }
            await doctorProfile.update({
                first_name: first_name !== undefined ? first_name : doctorProfile.first_name,
                last_name: last_name !== undefined ? last_name : doctorProfile.last_name,
                phone_number: phone_number !== undefined ? phone_number : doctorProfile.phone_number,
                specialty_id: specialty_id !== undefined ? specialty_id : doctorProfile.specialty_id
            });
        } else if (user.role === "patient") {
            let patientProfile = await Patient.findOne({ where: { user_id: id } });
            if (!patientProfile) {
                return res.status(400).json({ message: "Patient profile does not exist!" });
            }
            await patientProfile.update({
                first_name: first_name !== undefined ? first_name : patientProfile.first_name,
                last_name: last_name !== undefined ? last_name : patientProfile.last_name,
                CNP: CNP !== undefined ? CNP : patientProfile.CNP,
                gender: gender !== undefined ? gender : patientProfile.gender,
                phone_number: phone_number !== undefined ? phone_number : patientProfile.phone_number,
                address: address !== undefined ? address : patientProfile.address
            });
        }

        res.status(200).json({ message: "User successfully updated!", user });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user!" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
            return res.status(400).json({ message: "Invalid ID format!" });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        const doctorProfile = await Doctor.findOne({ where: { user_id: id } });
        if (doctorProfile) {
            await doctorProfile.destroy();
        }

        const patientProfile = await Patient.findOne({ where: { user_id: id } });
        if (patientProfile) {
            await patientProfile.destroy();
        }

        await user.destroy();

        res.status(200).json({ message: "User and associated data successfully deleted!" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user!" });
    }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
