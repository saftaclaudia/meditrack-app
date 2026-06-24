const Activity = require("../models/Activity");

const getActivities = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split("T")[0];
    const activities = await Activity.find({ user: req.user._id, date }).sort({ createdAt: -1 });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch activities" });
  }
};

const addActivity = async (req, res) => {
  try {
    const { date, name, duration, caloriesBurned, category } = req.body;
    const activity = await Activity.create({
      user: req.user._id,
      date,
      name,
      duration,
      caloriesBurned,
      category: category || "cardio",
    });
    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ message: "Failed to add activity" });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!activity) return res.status(404).json({ message: "Not found" });
    res.json({ id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete activity" });
  }
};

module.exports = { getActivities, addActivity, deleteActivity };
