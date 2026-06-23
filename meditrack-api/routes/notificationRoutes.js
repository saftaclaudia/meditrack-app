const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  createNotification,
  getNotifPrefs,
  updateNotifPrefs,
} = require("../controllers/notificationController");

router.use(protect);

// Prefs — must be before /:id to avoid "prefs" being matched as an id
router.get("/prefs", getNotifPrefs);
router.patch("/prefs", updateNotifPrefs);

router.get("/", getNotifications);
router.post("/", createNotification);
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", markAsRead);
router.delete("/", clearAllNotifications);
router.delete("/:id", deleteNotification);

module.exports = router;
