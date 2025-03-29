const express = require("express");
const router = express.Router();
const { userController } = require("../controllers");
const { checkAuth, checkPermission, checkSelfOrAdmin } = require("../middlewares/checkPermission");

router.get("/", checkAuth, checkPermission(["admin"]), userController.getAllUsers);
router.get("/:id", checkAuth, checkSelfOrAdmin, userController.getUserById);
router.put("/:id", checkAuth, checkSelfOrAdmin, userController.updateUser);
router.delete("/:id", checkAuth, checkPermission(["admin"]), userController.deleteUser);

module.exports = router;
