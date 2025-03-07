const express = require("express");
const router = express.Router();
const { patientController } = require("../controllers");
const { checkAuth, checkPermission, checkSelfOrAdmin } = require("../middlewares/checkPermission");

router.get("/", checkAuth, checkPermission(["admin"]), patientController.getAllPatients);
router.get("/:id", checkAuth, checkSelfOrAdmin, patientController.getPatientById);
router.get("/:id/medical-history", checkAuth, checkSelfOrAdmin, patientController.getPatientMedicalHistory);
router.get("/:id/prescriptions", checkAuth, checkSelfOrAdmin, patientController.getPatientPrescriptions);
router.post("/medical-note", checkAuth, checkPermission(["doctor"]), patientController.addMedicalNote);
router.get("/:id/appointments", checkAuth, checkSelfOrAdmin, patientController.getPatientAppointments);

module.exports = router;
