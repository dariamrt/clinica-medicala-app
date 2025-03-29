const { Specialty } = require("../models");

const createSpecialty = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || name.trim().length < 3) {
            return res.status(400).json({ message: "The specialty name must have at least 3 characters!" });
        }

        const existingSpecialty = await Specialty.findOne({ where: { name } });
        if (existingSpecialty) {
            return res.status(400).json({ message: "The specialty already exists!" });
        }

        const newSpecialty = await Specialty.create({ name });

        res.status(201).json({ message: "Specialty successfully created!", specialty: newSpecialty });
    } catch (error) {
        console.error("Error creating specialty:", error);
        res.status(500).json({ message: "Error creating specialty!" });
    }
};

const getAllSpecialties = async (req, res) => {
    try {
        const specialties = await Specialty.findAll();
        res.status(200).json(specialties);
    } catch (error) {
        console.error("Error fetching specialties:", error);
        res.status(500).json({ message: "Error fetching specialties!" });
    }
};

const getSpecialtyById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
            return res.status(400).json({ message: "Invalid ID format!" });
        }

        const specialty = await Specialty.findByPk(id);

        if (!specialty) {
            return res.status(404).json({ message: "Specialty not found!" });
        }

        res.status(200).json(specialty);
    } catch (error) {
        console.error("Error fetching specialty:", error);
        res.status(500).json({ message: "Error fetching specialty!" });
    }
};

const updateSpecialty = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
            return res.status(400).json({ message: "Invalid ID format!" });
        }

        const specialty = await Specialty.findByPk(id);
        if (!specialty) {
            return res.status(404).json({ message: "Specialty not found!" });
        }

        if (!name || name.trim().length < 3) {
            return res.status(400).json({ message: "The specialty name must have at least 3 characters!" });
        }

        if (specialty.name === name) {
            return res.status(200).json({ message: "No changes detected!", specialty });
        }

        specialty.name = name;
        await specialty.save();
        res.status(200).json({ message: "Specialty successfully updated!", specialty });
    } catch (error) {
        console.error("Error updating specialty:", error);
        res.status(500).json({ message: "Error updating specialty!" });
    }
};

const deleteSpecialty = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
            return res.status(400).json({ message: "Invalid ID format!" });
        }

        const specialty = await Specialty.findByPk(id);
        if (!specialty) {
            return res.status(404).json({ message: "Specialty not found!" });
        }

        await specialty.destroy();
        res.status(200).json({ message: "Specialty successfully deleted!" });
    } catch (error) {
       // console.error("Error deleting specialty:", error);
        res.status(500).json({ message: "Error deleting specialty!" });
    }
};

module.exports = {
    createSpecialty,
    getAllSpecialties,
    getSpecialtyById,
    updateSpecialty,
    deleteSpecialty,
};
