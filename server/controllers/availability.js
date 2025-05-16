const { Availability } = require("../models");
const { Op } = require("sequelize");

const createAvailability = async (req, res) => {
    try {
        const { doctor_id, date, start_time, end_time } = req.body;

        if (!doctor_id || !date || !start_time || !end_time) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const parseTime = (timeStr) => {
            const [hours, minutes] = timeStr.split(":").map(Number);
            return hours * 60 + minutes;
        };

        const startMinutes = parseTime(start_time);
        const endMinutes = parseTime(end_time);

        if (startMinutes >= endMinutes) {
            return res.status(400).json({ message: "Start time must be before end time!" });
        }

        const existingAvailabilities = await Availability.findAll({
            where: { doctor_id, date }
        });

        console.log("existingAvailabilities:", existingAvailabilities);
        const isOverlapping = existingAvailabilities.some((avail) => {
            const existingStart = parseTime(avail.start_time.slice(0,5));
            const existingEnd = parseTime(avail.end_time.slice(0,5));
            return startMinutes < existingEnd && endMinutes > existingStart;
        });

        if (isOverlapping) {
            return res.status(400).json({ message: "The availability overlaps with an existing one!" });
        }

        const newAvailability = await Availability.create({
            doctor_id,
            date,
            start_time,
            end_time,
            appointment_id: null,
        });

        return res.status(201).json({
            message: "Availability added successfully!",
            availability: newAvailability,
        });

    } catch (error) {
        console.error("Error adding availability:", error);
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({
                message: "This exact availability already exists!",
            });
        }
        return res.status(500).json({ message: "Error adding availability!" });
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

        if (!date || !start_time || !end_time) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const parseTime = (timeStr) => {
            const [hours, minutes] = timeStr.split(":").map(Number);
            return hours * 60 + minutes;
        };

        const startMinutes = parseTime(start_time);
        const endMinutes = parseTime(end_time);

        if (startMinutes >= endMinutes) {
            return res.status(400).json({ message: "Start time must be before end time!" });
        }

        const overlappingAvailability = await Availability.findOne({
            where: {
                doctor_id: availability.doctor_id,
                date,
                id: { [Op.ne]: id }, 
                [Op.or]: [
                    { start_time: { [Op.lt]: end_time }, end_time: { [Op.gt]: start_time } }
                ]
            }
        });

        if (overlappingAvailability) {
            return res.status(400).json({ message: "The availability overlaps with an existing one!" });
        }

        await availability.update({ date, start_time, end_time });

        return res.status(200).json({ message: "Availability updated successfully!", availability });

    } catch (error) {
        console.error("Error updating availability:", error);
        return res.status(500).json({ message: "Error updating availability!" });
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

const getAllAvailabilities = async (req, res) => {
  try {
    const availabilities = await Availability.findAll({
      order: [["date", "ASC"], ["start_time", "ASC"]],
    });
    res.status(200).json(availabilities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all availabilities!" });
  }
};

module.exports = {
    createAvailability,
    getAvailabilityByDoctor,
    getAvailabilityById,
    updateAvailability,
    deleteAvailability,
    getAllAvailabilities
};
