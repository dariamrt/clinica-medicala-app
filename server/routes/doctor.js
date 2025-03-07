const express = require("express");
const router = express.Router();
const { doctorController } = require("../controllers");
const { checkAuth, checkSelfOrAdmin } = require("../middlewares/checkPermission");

router.get("/", checkAuth, doctorController.getAllDoctors);
router.get("/:id", checkAuth, doctorController.getDoctorById);
router.get("/specialty/:specialty_id", checkAuth, doctorController.getDoctorsBySpecialty);
router.get("/:id/appointments", checkAuth, checkSelfOrAdmin, doctorController.getDoctorAppointments);

module.exports = router;
