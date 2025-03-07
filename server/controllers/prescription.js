const { Prescription, MedicalHistory } = require("../models");

const createPrescription = async (req, res) => {
    try {
        const { medical_history_id, content } = req.body;

        if (!medical_history_id || !content) {
            return res.status(400).json({ message: "Medical history ID and prescription content are required!" });
        }

        const medicalHistory = await MedicalHistory.findByPk(medical_history_id);
        if (!medicalHistory) {
            return res.status(404).json({ message: "Medical history record not found!" });
        }

        const newPrescription = await Prescription.create({
            content,
            medical_history_id,
        });

        res.status(201).json({ message: "Prescription successfully added!", prescription: newPrescription });
    } catch (error) {
        res.status(500).json({ message: "Error creating prescription!" });
    }
};

const getAllPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Prescription.findAll();
        res.status(200).json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching prescriptions!" });
    }
};

const getPrescriptionById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
            return res.status(400).json({ message: "Invalid ID format!" });
        }

        const prescription = await Prescription.findByPk(id);
        if (!prescription) {
            return res.status(404).json({ message: "Prescription not found!" });
        }

        res.status(200).json(prescription);
    } catch (error) {
        res.status(500).json({ message: "Error fetching prescription!" });
    }
};

const getPrescriptionsByPatientId = async (req, res) => {
    try {
        const { patient_id } = req.params;

        if (!/^[0-9a-fA-F-]{36}$/.test(patient_id)) {
            return res.status(400).json({ message: "Invalid patient ID format!" });
        }

        const prescriptions = await Prescription.findAll({
            include: {
                model: MedicalHistory,
                where: { patient_id },
                attributes: ["id", "diagnosis", "doctor_id"],
            },
        });

        res.status(200).json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching patient's prescriptions!" });
    }
};

const updatePrescription = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!content || typeof content !== "object") {
            return res.status(400).json({ message: "Prescription content is required and must be a JSON object!" });
        }

        if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
            return res.status(400).json({ message: "Invalid ID format!" });
        }

        const prescription = await Prescription.findByPk(id);
        if (!prescription) {
            return res.status(404).json({ message: "Prescription not found!" });
        }

        prescription.content = content;
        await prescription.save();

        res.status(200).json({ message: "Prescription successfully updated!", prescription });
    } catch (error) {
        res.status(500).json({ message: "Error updating prescription!" });
    }
};

const deletePrescription = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
            return res.status(400).json({ message: "Invalid ID format!" });
        }

        const prescription = await Prescription.findByPk(id);
        if (!prescription) {
            return res.status(404).json({ message: "Prescription not found!" });
        }

        await prescription.destroy();
        res.status(200).json({ message: "Prescription successfully deleted!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting prescription!" });
    }
};

module.exports = {
    createPrescription,
    getAllPrescriptions,
    getPrescriptionById,
    getPrescriptionsByPatientId,
    updatePrescription,
    deletePrescription,
};
