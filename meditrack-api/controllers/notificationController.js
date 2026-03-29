const Notification = require("../models/Notification");

// GET /notifications -fetch all for logged-in user
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// PATCH /notification/:id/read - mark one as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      { read: true },
      { new: true },
    );
    if (!notification) return res.status(404).json({ messge: "Not found" });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: "Failed to update notification" });
  }
};

// PATCH /notification/read-all - mark all as read
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true },
    );
    res.json({ message: "All marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update notifications" });
  }
};
// POST /notifications - create a new notification
const createNotification = async (req, res) => {
  try {
    const { title, message, type } = req.body;
    const notification = await Notification.create({
      user: req.user._id,
      title,
      message,
      type: type || "general",
    });
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: "Failed to create notification" });
  }
};
module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
};
