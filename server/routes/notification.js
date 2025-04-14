const express = require("express");
const router = express.Router();
const { notificationController } = require("../controllers");
const { checkAuth, checkPermission, checkSelfOrAdmin } = require("../middlewares/checkPermission");

router.get("/user/:user_id", checkAuth, checkPermission(["admin"]), notificationController.getNotificationsByUser);
router.post("/", checkAuth, checkPermission(["admin", "doctor"]), notificationController.createNotification);
router.put("/:id/read", checkAuth, notificationController.markNotificationAsRead);
router.delete("/:id", checkAuth, checkPermission(["admin", "doctor", "patient"]), notificationController.deleteNotification);
router.get("/me", checkAuth, notificationController.getNotificationsForCurrentUser);

module.exports = router; 
