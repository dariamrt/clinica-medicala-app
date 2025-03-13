const express = require("express");
const router = express.Router();
const { availabilityController } = require("../controllers");
const { checkAuth, checkPermission } = require("../middlewares/checkPermission");

router.post("/", checkAuth, checkPermission(["admin"]), availabilityController.createAvailability);
router.get("/doctor/:doctor_id", checkAuth, availabilityController.getAvailabilityByDoctor);
router.get("/:id", checkAuth, availabilityController.getAvailabilityById);
router.put("/:id", checkAuth, checkPermission(["admin"]), availabilityController.updateAvailability);
router.delete("/:id", checkAuth, checkPermission(["admin"]), availabilityController.deleteAvailability);

module.exports = router;
