const { Availability } = require("../models");

const createAvailability = async (req, res) => {
    try {
        const { doctor_id, date, start_time, end_time } = req.body;

        if (!doctor_id || !date || !start_time || !end_time) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const newAvailability = await Availability.create({
            doctor_id,
            date,
            start_time,
            end_time,
            appointment_id: null,
        });

        res.status(201).json({ message: "Availability added successfully!", availability: newAvailability });
    } catch (error) {
        res.status(500).json({ message: "Error adding availability!" });
    }
};

const getAvailabilityByDoctor = async (req, res) => {
    try {
        const { doctor_id } = req.params;

        if (!doctor_id) {
            return res.status(400).json({ message: "Doctor ID is required!" });
        }

        const availabilities = await Availability.findAll({
            where: { doctor_id, appointment_id: null },
            order: [["date", "ASC"], ["start_time", "ASC"]],
        });

        res.status(200).json(availabilities);
    } catch (error) {
        res.status(500).json({ message: "Error fetching doctor's availabilities!" });
    }
};

const getAvailabilityById = async (req, res) => {
    try {
        const { id } = req.params;

        const availability = await Availability.findByPk(id);
        if (!availability) {
            return res.status(404).json({ message: "Availability not found!" });
        }

        res.status(200).json(availability);
    } catch (error) {
        res.status(500).json({ message: "Error fetching availability!" });
    }
};

const updateAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, start_time, end_time } = req.body;

        const availability = await Availability.findByPk(id);
        if (!availability) {
            return res.status(404).json({ message: "Availability not found!" });
        }

        if (availability.appointment_id !== null) {
            return res.status(400).json({ message: "Cannot modify an availability that has a booked appointment!" });
        }

        await availability.update({
            date: date || availability.date,
            start_time: start_time || availability.start_time,
            end_time: end_time || availability.end_time,
        });

        res.status(200).json({ message: "Availability updated successfully!", availability });
    } catch (error) {
        res.status(500).json({ message: "Error updating availability!" });
    }
};

const deleteAvailability = async (req, res) => {
    try {
        const { id } = req.params;

        const availability = await Availability.findByPk(id);
        if (!availability) {
            return res.status(404).json({ message: "Availability not found!" });
        }

        if (availability.appointment_id !== null) {
            return res.status(400).json({ message: "Cannot delete an availability that has a booked appointment!" });
        }

        await availability.destroy();
        res.status(200).json({ message: "Availability deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting availability!" });
    }
};

module.exports = {
    createAvailability,
    getAvailabilityByDoctor,
    getAvailabilityById,
    updateAvailability,
    deleteAvailability,
};
