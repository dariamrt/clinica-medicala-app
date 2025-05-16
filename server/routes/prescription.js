const express = require("express");
const router = express.Router();
const { prescriptionController } = require("../controllers");
const { checkAuth, checkPermission } = require("../middlewares/checkPermission");

router.get("/medical-history/:id", checkAuth, checkPermission(["admin", "doctor"]), prescriptionController.getPrescriptionsByMedicalHistoryId);
router.get("/", checkAuth, checkPermission(["admin", "doctor"]), prescriptionController.getAllPrescriptions);
router.get("/:id", checkAuth, checkPermission(["admin", "doctor"]), prescriptionController.getPrescriptionById);
router.put("/:id", checkAuth, checkPermission(["admin", "doctor"]), prescriptionController.updatePrescription);
router.delete("/:id", checkAuth, checkPermission(["admin"]), prescriptionController.deletePrescription);

module.exports = router;
