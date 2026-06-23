const CalorieLog = require("../models/CalorieLog");
const { createIfNotExists } = require("../services/notificationService");

const toDateString = (date) => new Date(date).toISOString().split("T")[0];

// GET /calories?date= YYYY-MM-DD
const getDayLog = async (req, res) => {
  try {
    const date = req.query.date || toDateString(new Date());
    const log = await CalorieLog.findOne({ user: req.user._id, date });

    if (!log) {
      return res.json(null);
    }
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch calorie log" });
  }
};

// POST /calories
const addEntry = async (req, res) => {
  try {
    const { date, mealType, entry, dailyGoal } = req.body;

    let log = await CalorieLog.findOne({ user: req.user._id, date });

    if (!log) {
      log = await CalorieLog.create({
        user: req.user._id,
        date,
        dailyGoal: dailyGoal || 2000,
        meals: [
          { type: "breakfast", entries: [] },
          { type: "lunch", entries: [] },
          { type: "dinner", entries: [] },
          { type: "snack", entries: [] },
        ],
      });
    }
    const meal = log.meals.find((m) => m.type === mealType);
    if (!meal) {
      return res.status(400).json({ message: "Invalid meal type" });
    }

    const prevTotal = log.meals.reduce(
      (sum, m) => sum + m.entries.reduce((s, e) => s + (e.calories || 0), 0), 0
    );

    meal.entries.push(entry);
    await log.save();

    const newTotal = prevTotal + (entry.calories || 0);
    if (newTotal >= log.dailyGoal && prevTotal < log.dailyGoal) {
      await createIfNotExists({
        user: req.user._id,
        title: "Daily goal reached!",
        message: `You've logged ${newTotal} kcal — your daily goal of ${log.dailyGoal} kcal has been reached.`,
        type: "result",
      });
    }

    res.json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add entry" });
  }
};

// DELETE /calorie/:date/meals/:mealType/entries/:entryId
const deleteEntry = async (req, res) => {
  try {
    const { date, mealType, entryId } = req.params;
    const log = await CalorieLog.findOneAndUpdate(
      { user: req.user._id, date },
      { $pull: { [`meals.$[meal].entries`]: { _id: entryId } } },
      { arrayFilters: [{ "meal.type": mealType }], new: true },
    );

    if (!log) return res.status(404).json({ message: "Log not found" });
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: "Failedto delete entry" });
  }
};

// PATCH /calories/:date/goal
const updateGoal = async (req, res) => {
  try {
    const { date } = req.params;
    const { dailyGoal } = req.body;

    const log = await CalorieLog.findOneAndUpdate(
      {
        user: req.user._id,
        date,
      },
      { $set: { dailyGoal } },
      { new: true, upsert: true },
    );
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: "Failed to update goal" });
  }
};

// GET /calories/history
const getHistory = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const fromDate = toDateString(thirtyDaysAgo);
    const logs = await CalorieLog.find({
      user: req.user._id,
      date: { $gte: fromDate },
    }).sort({ date: 1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
};
module.exports = { getDayLog, addEntry, deleteEntry, updateGoal, getHistory };
