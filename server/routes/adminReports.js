const express = require("express");
const router = express.Router();
const { adminReportController } = require("../controllers"); 
const { checkAuth, checkPermission } = require("../middlewares/checkPermission");

router.get("/cancellation-rate", checkAuth, checkPermission(["admin"]), adminReportController.getAppointmentCancellationRate);
router.get("/peak-hours", checkAuth, checkPermission(["admin"]), adminReportController.getPeakAppointmentHours);
router.get('/peak-hours/:day', adminReportController.getPeakAppointmentHoursByDay); 
router.get("/common-diagnoses", checkAuth, checkPermission(["admin"]), adminReportController.getCommonDiagnoses);
router.get("/doctor-performance", checkAuth, checkPermission(["admin"]), adminReportController.getDoctorPerformanceReport);
router.post("/save", checkAuth, checkPermission(["admin"]), adminReportController.saveReport);
router.get("/stored", checkAuth, checkPermission(["admin"]), adminReportController.getStoredReports);
router.get("/:id", checkAuth, checkPermission(["admin"]), adminReportController.getReportById);
router.delete("/:id", checkAuth, checkPermission(["admin"]), adminReportController.deleteReport);
router.post("/predict-no-show", checkAuth, checkPermission(["admin"]), adminReportController.predictAppointmentNoShow);
router.post('/predict-no-show-by-patient', checkAuth, checkPermission(['admin']), adminReportController.predictAppointmentNoShowByPatientId);

module.exports = router;
