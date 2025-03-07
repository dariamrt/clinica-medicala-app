const { MedicalHistory, Prescription } = require("../models");

const getAllMedicalRecords = async (req, res) => {
    try {
        const records = await MedicalHistory.findAll({
            attributes: ["id", "patient_id", "doctor_id", "diagnosis", "notes", "createdAt"],
            include: { model: Prescription, attributes: ["id", "content"] },
        });
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: "Error fetching medical history!" });
    }
};

const getMedicalRecordById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
            return res.status(400).json({ message: "Invalid ID format!" });
        }

        const record = await MedicalHistory.findByPk(id, {
            attributes: ["id", "patient_id", "doctor_id", "diagnosis", "notes", "createdAt"],
            include: { model: Prescription, attributes: ["id", "content"] },
        });

        if (!record) {
            return res.status(404).json({ message: "Medical history record not found!" });
        }

        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ message: "Error fetching medical history record!" });
    }
};

const updateMedicalRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const { diagnosis, doctor_id, notes, prescription_content } = req.body;

        if (!diagnosis && !doctor_id && !notes && !prescription_content) {
            return res.status(400).json({ message: "At least one field must be updated!" });
        }

        const record = await MedicalHistory.findByPk(id);
        if (!record) {
            return res.status(404).json({ message: "Medical history record not found!" });
        }

        if (diagnosis) record.diagnosis = diagnosis;
        if (doctor_id) record.doctor_id = doctor_id;
        if (notes !== undefined) record.notes = notes;
        await record.save();

        if (prescription_content) {
            let prescription = await Prescription.findOne({ where: { medical_history_id: id } });

            if (prescription) {
                prescription.content = prescription_content;
                await prescription.save();
            } else {
                await Prescription.create({ content: prescription_content, medical_history_id: id });
            }
        }

        res.status(200).json({ message: "Medical history record updated!", record });
    } catch (error) {
        res.status(500).json({ message: "Error updating medical history record!" });
    }
};

const deleteMedicalRecord = async (req, res) => {
    try {
        const { id } = req.params;

        const record = await MedicalHistory.findByPk(id);
        if (!record) {
            return res.status(404).json({ message: "Medical history record not found!" });
        }

        await Prescription.destroy({ where: { medical_history_id: id } });
        await record.destroy();

        res.status(200).json({ message: "Medical history record and associated prescriptions deleted!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting medical history record!" });
    }
};

module.exports = {
    getAllMedicalRecords,
    getMedicalRecordById,
    updateMedicalRecord,
    deleteMedicalRecord,
};
