const express = require("express");
const router = express.Router();
const { patientController } = require("../controllers");
const { checkAuth, checkPermission, checkSelfOrAdmin, checkSelfOrDoctorOrAdmin } = require("../middlewares/checkPermission");

router.get("/", checkAuth, checkPermission(["admin"]), patientController.getAllPatients);
router.get("/:id", checkAuth, checkSelfOrAdmin, patientController.getPatientById);
router.get("/:id/medical-history", checkAuth, checkSelfOrDoctorOrAdmin, patientController.getPatientMedicalHistory);
router.get("/:id/prescriptions", checkAuth, checkSelfOrDoctorOrAdmin, patientController.getPatientPrescriptions);
router.post("/medical-note", checkAuth, checkPermission(["doctor"]), patientController.addMedicalNote);
router.post("/prescription", checkAuth, checkPermission(["doctor"]), patientController.addPrescription);
router.get("/:id/appointments", checkAuth, checkSelfOrAdmin, patientController.getPatientAppointments);

module.exports = router;
