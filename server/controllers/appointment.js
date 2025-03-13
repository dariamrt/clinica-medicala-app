const { Appointment, Availability, Notification, User } = require("../models");

const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments!" });
    }
};

const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found!" });
        }
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointment!" });
    }
};

const bookAppointment = async (req, res) => {
    try {
        const { availability_id, reimbursed_by_CAS } = req.body; 
        const patient_id = req.user.id; 

        const availability = await Availability.findByPk(availability_id);

        if (!availability || availability.appointment_id !== null) {
            return res.status(400).json({ message: "This time slot is not available!" });
        }

        const newAppointment = await Appointment.create({
            patient_id,
            doctor_id: availability.doctor_id,
            date: availability.date,
            start_time: availability.start_time,
            end_time: availability.end_time,
            status: "confirmed",
            reimbursed_by_CAS: reimbursed_by_CAS !== undefined ? reimbursed_by_CAS : false, 
        });

        await availability.update({ appointment_id: newAppointment.id });

        const doctor = await User.findByPk(availability.doctor_id);
        const patient = await User.findByPk(patient_id);

        if (doctor) {
            await Notification.create({
                user_id: doctor.id,
                message: `You have a new appointment on ${availability.date} from ${availability.start_time} to ${availability.end_time}.`
            });
        }

        if (patient) {
            await Notification.create({
                user_id: patient.id,
                message: `You have been scheduled on ${availability.date} from ${availability.start_time} to ${availability.end_time}.`
            });
        }

        res.status(201).json({ message: "Appointment successfully booked!", appointment: newAppointment });
    } catch (error) {
        res.status(500).json({ message: "Error booking appointment!" });
    }
};

const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { new_availability_id } = req.body;

        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found!" });
        }

        const now = new Date();
        const appointmentDate = new Date(appointment.date);
        if (appointmentDate - now < 24 * 60 * 60 * 1000) {
            return res.status(400).json({ message: "Appointments can only be modified at least 24 hours in advance!" });
        }

        const oldAvailability = await Availability.findOne({ where: { appointment_id: id } });
        if (oldAvailability) {
            await oldAvailability.update({ appointment_id: null });
        }

        const newAvailability = await Availability.findByPk(new_availability_id);
        if (!newAvailability || newAvailability.appointment_id !== null) {
            return res.status(400).json({ message: "The selected time slot is not available!" });
        }

        await newAvailability.update({ appointment_id: appointment.id });

        await appointment.update({
            date: newAvailability.date,
            start_time: newAvailability.start_time,
            end_time: newAvailability.end_time,
        });

        res.status(200).json({ message: "Appointment successfully updated!", appointment });
    } catch (error) {
        res.status(500).json({ message: "Error updating appointment!" });
    }
};

const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found!" });
        }

        const now = new Date();
        const appointmentDate = new Date(appointment.date);
        if (appointmentDate - now < 24 * 60 * 60 * 1000) {
            return res.status(400).json({ message: "Appointments can only be canceled at least 24 hours in advance!" });
        }

        await appointment.update({ status: "cancelled" });

        const availability = await Availability.findOne({ where: { appointment_id: id } });
        if (availability) {
            await availability.update({ appointment_id: null });
        }

        await Notification.create({
            user_id: appointment.doctor_id,
            message: `The patient has canceled the appointment on ${appointment.date} at ${appointment.start_time}.`
        });

        res.status(200).json({ message: "Appointment successfully canceled!" });

    } catch (error) {
        res.status(500).json({ message: "Error canceling appointment!" });
    }
};

module.exports = {
    getAllAppointments,
    getAppointmentById,
    bookAppointment,
    updateAppointment,
    deleteAppointment,
};
