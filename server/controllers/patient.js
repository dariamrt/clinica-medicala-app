const { Patient, MedicalHistory, Prescription, Doctor, User, Appointment } = require("../models");

const getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.findAll({
            attributes: ["user_id", "first_name", "last_name", "CNP", "gender", "phone_number", "address"],
        });
        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ message: "Error fetching patients!" });
    }
};

const getPatientById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
            return res.status(400).json({ message: "Invalid ID format!" });
        }

        const patient = await Patient.findByPk(id, {
            attributes: ["user_id", "first_name", "last_name", "CNP", "gender", "phone_number", "address"],
        });

        if (!patient) {
            return res.status(404).json({ message: "Patient not found!" });
        }

        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ message: "Error fetching patient!" });
    }
};

const getPatientMedicalHistory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
            return res.status(400).json({ message: "Invalid ID format!" });
        }

        const history = await MedicalHistory.findAll({
            where: { patient_id: id },
            attributes: ["id", "diagnosis", "doctor_id", "notes", "createdAt", "updatedAt"],
        });

        res.status(200).json(history);
    } catch (error) {
        console.error("Error fetching medical history: ", error);
        res.status(500).json({ message: "Error fetching medical history!", error: error.message });
    }
};

const getPatientPrescriptions = async (req, res) => {
    try {
        const { id } = req.params; 

        if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
            return res.status(400).json({ message: "Invalid patient ID format!" });
        }

        const prescriptions = await Prescription.findAll({
            include: {
                model: MedicalHistory,
                where: { patient_id: id },
                attributes: ["id", "diagnosis", "doctor_id"],
            },
        });

        res.status(200).json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching patient's prescriptions!" });
    }
};

const addMedicalNote = async (req, res) => {
    try {
        const { patient_id, doctor_id, diagnosis, prescription_id, notes } = req.body;

        if (!patient_id || !doctor_id || !diagnosis) {
            return res.status(400).json({ message: "All required fields must be filled!" });
        }

        const patientExists = await Patient.findByPk(patient_id);
        if (!patientExists) return res.status(404).json({ message: "Patient not found!" });

        const doctorExists = await Doctor.findByPk(doctor_id);
        if (!doctorExists) return res.status(404).json({ message: "Doctor not found!" });

        const newRecord = await MedicalHistory.create({
            patient_id,
            doctor_id,
            diagnosis,
            prescription_id: prescription_id || null,
            record_date: new Date(),
            notes,
        });

        res.status(201).json({ message: "Medical note added!", record: newRecord });
    } catch (error) {
        res.status(500).json({ message: "Error adding medical note!" });
    }
};

const getPatientAppointments = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
            return res.status(400).json({ message: "Invalid patient ID format!" });
        }

        if (req.user.role !== "admin" && req.user.id !== id) {
            return res.status(403).json({ message: "Access denied!" });
        }

        const patient = await Patient.findOne({ where: { user_id: id } });
        if (!patient) {
            return res.status(404).json({ message: "Patient not found!" });
        }

        const appointments = await Appointment.findAll({
            where: { patient_id: id },
            attributes: ["id", "doctor_id", "date", "start_time", "end_time", "status"],
            include: {
                model: User,
                as: "doctor",
                attributes: ["id", "email"],
            },
        });

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching patient's appointments!" });
    }
};

module.exports = { 
    getAllPatients, 
    getPatientById, 
    getPatientMedicalHistory, 
    getPatientPrescriptions,
    addMedicalNote,
    getPatientAppointments 
};
