const express = require("express");
const router = express.Router();
const { notificationController } = require("../controllers");
const { checkAuth, checkPermission, checkSelfOrAdmin } = require("../middlewares/checkPermission");

router.get("/user/:user_id", checkAuth, checkSelfOrAdmin, notificationController.getNotificationsByUser);
router.get("/:id", checkAuth, checkSelfOrAdmin, notificationController.getNotificationById);
router.post("/", checkAuth, checkPermission(["admin", "doctor"]), notificationController.createNotification);
router.put("/:id/read", checkAuth, checkSelfOrAdmin, notificationController.markNotificationAsRead);
router.delete("/:id", checkAuth, checkPermission(["admin"]), notificationController.deleteNotification);

module.exports = router;
