const Notification = require("../models/Notification");
const User = require("../models/User");

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: "Not found" });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: "Failed to update notification" });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.json({ message: "All marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update notifications" });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!notification) return res.status(404).json({ message: "Not found" });
    res.json({ id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete notification" });
  }
};

const clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user._id });
    res.json({ message: "All notifications cleared" });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear notifications" });
  }
};

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

const getNotifPrefs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("notificationPrefs");
    res.json(user.notificationPrefs ?? { exams: true, calories: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch preferences" });
  }
};

const updateNotifPrefs = async (req, res) => {
  try {
    const { exams, calories } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { "notificationPrefs.exams": exams, "notificationPrefs.calories": calories } },
      { new: true }
    ).select("notificationPrefs");
    res.json(user.notificationPrefs);
  } catch (err) {
    res.status(500).json({ message: "Failed to update preferences" });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  createNotification,
  getNotifPrefs,
  updateNotifPrefs,
};
