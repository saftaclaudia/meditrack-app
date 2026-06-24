const WaterLog = require("../models/WaterLog");

const getWater = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split("T")[0];
    const log = await WaterLog.findOne({ user: req.user._id, date });
    res.json({ glasses: log?.glasses ?? 0 });
  } catch {
    res.status(500).json({ message: "Failed to fetch water log" });
  }
};

const setWater = async (req, res) => {
  try {
    const { date, glasses } = req.body;
    const log = await WaterLog.findOneAndUpdate(
      { user: req.user._id, date },
      { glasses: Math.max(0, glasses) },
      { upsert: true, new: true }
    );
    res.json({ glasses: log.glasses });
  } catch {
    res.status(500).json({ message: "Failed to update water log" });
  }
};

module.exports = { getWater, setWater };
