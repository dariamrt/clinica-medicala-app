const express = require("express");
const router = express.Router();
const { adminReportController } = require("../controllers"); 
const { checkAuth, checkPermission } = require("../middlewares/checkPermission");

router.get("/cancellation-rate", checkAuth, checkPermission(["admin"]), adminReportController.getAppointmentCancellationRate);
router.get("/peak-hours", checkAuth, checkPermission(["admin"]), adminReportController.getPeakAppointmentHours);
router.get("/common-diagnoses", checkAuth, checkPermission(["admin"]), adminReportController.getCommonDiagnoses);
router.get("/doctor-performance", checkAuth, checkPermission(["admin"]), adminReportController.getDoctorPerformanceReport);
router.post("/generate", checkAuth, checkPermission(["admin"]), adminReportController.generateReport);
router.get("/stored", checkAuth, checkPermission(["admin"]), adminReportController.getStoredReports);
router.get("/download/:id", checkAuth, checkPermission(["admin"]), adminReportController.downloadReport);
router.post("/predict-no-show", checkAuth, checkPermission(["admin"]), adminReportController.predictAppointmentNoShow);

module.exports = router;
