const cron = require("node-cron");
const { Appointment, Notification, User } = require("../models");
const { Op } = require("sequelize");

const getNotificationsByUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).json({ message: "User ID is required!" });
        }

        const notifications = await Notification.findAll({
            where: { user_id },
            order: [["createdAt", "DESC"]],
        });

        if (notifications.length === 0) {
            return res.status(404).json({ message: "No notifications found for this user." });
        }

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications!" });
    }
};

const getNotificationById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
            return res.status(400).json({ message: "Invalid ID format!" });
        }

        const notification = await Notification.findByPk(id);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found!" });
        }

        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notification!" });
    }
};

const getNotificationsForCurrentUser = async (req, res) => {
    try {
      const userId = req.user.id;
      const notifications = await Notification.findAll({
        where: { user_id: userId },
        order: [["createdAt", "DESC"]],
      });
  
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Eroare la preluarea notificărilor" });
    }
};

const createNotification = async (req, res) => {
    try {
        const { user_id, message, is_read } = req.body;

        if (!user_id || !message) {
            return res.status(400).json({ message: "User ID and message are required!" });
        }

        const userExists = await User.findByPk(user_id);
        if (!userExists) {
            return res.status(400).json({ message: "User does not exist!" });
        }

        const newNotification = await Notification.create({
            user_id,
            message,
            is_read: is_read || false,
        });

        res.status(201).json({ message: "Notification successfully created!", notification: newNotification });
    } catch (error) {
        res.status(500).json({ message: "Error creating notification!" });
    }
};

const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
            return res.status(400).json({ message: "Invalid ID format!" });
        }

        const notification = await Notification.findByPk(id);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found!" });
        }

        notification.is_read = true;
        await notification.save();
        res.status(200).json({ message: "Notification marked as read!", notification });
    } catch (error) {
        res.status(500).json({ message: "Error marking notification as read!" });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
            return res.status(400).json({ message: "Invalid ID format!" });
        }

        const notification = await Notification.findByPk(id);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found!" });
        }

        await notification.destroy();
        res.status(200).json({ message: "Notification successfully deleted!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting notification!" });
    }
};

const send24hReminder = async () => {
    try {
        const now = new Date();
        const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000); 

        const appointments = await Appointment.findAll({
            where: {
                date: {
                    [Op.between]: [now, next24h],
                },
            },
            include: [{ model: User, as: "patient" }, { model: User, as: "doctor" }],
        });

        for (const appointment of appointments) {
            const patient = await User.findByPk(appointment.patient_id);
            const doctor = await User.findByPk(appointment.doctor_id);

            if (patient) {
                const message = `Reminder: You have an appointment with Dr. ${doctor ? doctor.name : "Unknown"} on ${appointment.date} from ${appointment.start_time} to ${appointment.end_time}.`;

                await Notification.create({
                    user_id: patient.id,
                    message,
                });
            }
        }
    } catch (error) {
        console.error("Error sending appointment reminders:", error);
    }
};


cron.schedule("0 * * * *", send24hReminder, {
    scheduled: true,
    timezone: "Europe/Bucharest",
});

module.exports = {
    getNotificationsByUser,
    getNotificationById,
    getNotificationsForCurrentUser,
    createNotification,
    markNotificationAsRead,
    deleteNotification,
    send24hReminder,
};
