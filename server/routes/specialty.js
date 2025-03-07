const express = require("express");
const router = express.Router();
const { specialtyController } = require("../controllers");
const { checkAuth, checkPermission } = require("../middlewares/checkPermission");

router.post("/", checkAuth, checkPermission(["admin"]), specialtyController.createSpecialty);
router.get("/", specialtyController.getAllSpecialties);
router.get("/:id", specialtyController.getSpecialtyById);
router.put("/:id", checkAuth, checkPermission(["admin"]), specialtyController.updateSpecialty);
router.delete("/:id", checkAuth, checkPermission(["admin"]), specialtyController.deleteSpecialty);

module.exports = router;
