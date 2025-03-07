const express = require("express");
const router = express.Router();

const authRoutes = require("./auth");
const userRoutes = require("./user");
const patientRoutes = require("./patient");
const doctorRoutes = require("./doctor");
const appointmentRoutes = require("./appointment");
const medicalHistoryRoutes = require("./medicalHistory");
const prescriptionRoutes = require("./prescription");
const notificationRoutes = require("./notification");
const specialtyRoutes = require("./specialty");
const availabilityRoutes = require("./availability");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/patients", patientRoutes);
router.use("/doctors", doctorRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/medical-history", medicalHistoryRoutes);
router.use("/prescriptions", prescriptionRoutes);
router.use("/notifications", notificationRoutes);
router.use("/specialties", specialtyRoutes);
router.use("/availability", availabilityRoutes);

module.exports = router;
