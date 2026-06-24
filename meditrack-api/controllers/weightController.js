const WeightLog = require("../models/WeightLog");

const getWeightHistory = async (req, res) => {
  try {
    const logs = await WeightLog.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(90);
    res.json(logs);
  } catch {
    res.status(500).json({ message: "Failed to fetch weight history" });
  }
};

const logWeight = async (req, res) => {
  try {
    const { date, weight } = req.body;
    const log = await WeightLog.findOneAndUpdate(
      { user: req.user._id, date },
      { weight },
      { upsert: true, new: true }
    );
    res.json(log);
  } catch {
    res.status(500).json({ message: "Failed to log weight" });
  }
};

const deleteWeight = async (req, res) => {
  try {
    await WeightLog.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ id: req.params.id });
  } catch {
    res.status(500).json({ message: "Failed to delete weight entry" });
  }
};

module.exports = { getWeightHistory, logWeight, deleteWeight };
