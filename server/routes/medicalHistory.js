const express = require("express");
const router = express.Router();
const { medicalHistoryController } = require("../controllers");
const { checkAuth, checkPermission } = require("../middlewares/checkPermission");

router.get("/", checkAuth, checkPermission(["admin", "doctor"]), medicalHistoryController.getAllMedicalRecords);
router.get("/:id", checkAuth, checkPermission(["admin", "doctor"]), medicalHistoryController.getMedicalRecordById);
router.put("/:id", checkAuth, checkPermission(["admin", "doctor"]), medicalHistoryController.updateMedicalRecord);
router.delete("/:id", checkAuth, checkPermission(["admin"]), medicalHistoryController.deleteMedicalRecord);

module.exports = router;
