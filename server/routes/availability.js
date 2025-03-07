const express = require("express");
const router = express.Router();
const { availabilityController } = require("../controllers");
const { checkAuth, checkPermission } = require("../middlewares/checkPermission");

router.post("/", checkAuth, checkPermission(["doctor"]), availabilityController.createAvailability);
router.get("/doctor/:doctor_id", checkAuth, availabilityController.getAvailabilityByDoctor);
router.get("/:id", checkAuth, availabilityController.getAvailabilityById);
router.put("/:id", checkAuth, checkPermission(["doctor"]), availabilityController.updateAvailability);
router.delete("/:id", checkAuth, checkPermission(["doctor"]), availabilityController.deleteAvailability);

module.exports = router;
