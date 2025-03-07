const express = require("express");
const router = express.Router();
const { appointmentController } = require("../controllers");
const { checkAuth, checkPermission, checkSelfOrAdmin } = require("../middlewares/checkPermission");

router.get("/", checkAuth, checkPermission(["admin"]), appointmentController.getAllAppointments);
router.get("/:id", checkAuth, checkSelfOrAdmin, appointmentController.getAppointmentById);
router.post("/book", checkAuth, checkPermission(["patient"]), appointmentController.bookAppointment);
router.put("/:id", checkAuth, checkPermission(["doctor", "admin"]), appointmentController.updateAppointment);
router.delete("/:id", checkAuth, checkSelfOrAdmin, appointmentController.deleteAppointment);

module.exports = router;
