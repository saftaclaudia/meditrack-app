const cron = require("node-cron");
const User = require("../models/User");
const CalorieLog = require("../models/CalorieLog");
const WaterLog = require("../models/WaterLog");
const { createIfNotExists } = require("../services/notificationService");

const todayStr = () => new Date().toISOString().split("T")[0];

// 20:00 — general calorie reminder
const scheduleCaloriesReminder = () => {
  cron.schedule("0 20 * * *", async () => {
    const users = await User.find({ "notificationPrefs.calories": { $ne: false } }, "_id");
    for (const user of users) {
      await createIfNotExists({
        user: user._id,
        title: "Diet journal",
        message: "Don't forget to log today's calories.",
        type: "general",
      });
    }
  });
};

// 18:00 — calorie pacing: warn if < 40% of goal logged
const scheduleCaloriePacing = () => {
  cron.schedule("0 18 * * *", async () => {
    const users = await User.find({ "notificationPrefs.caloriesPacing": true });
    const date = todayStr();
    for (const user of users) {
      const log = await CalorieLog.findOne({ user: user._id, date });
      if (!log) continue;
      const consumed = log.meals.reduce(
        (t, m) => t + m.entries.reduce((s, e) => s + e.calories, 0), 0
      );
      const goal = log.dailyGoal || 2000;
      if (consumed < goal * 0.4) {
        await createIfNotExists({
          user: user._id,
          title: "Calorie pacing",
          message: `You've only logged ${consumed} kcal so far. Try to reach your goal of ${goal} kcal.`,
          type: "general",
        });
      }
    }
  });
};

// 12:00 & 19:00 — water reminders if below 4 glasses by noon or below 6 by evening
const scheduleWaterReminders = () => {
  cron.schedule("0 12 * * *", async () => {
    const users = await User.find({ "notificationPrefs.waterReminder": true }, "_id");
    const date = todayStr();
    for (const user of users) {
      const log = await WaterLog.findOne({ user: user._id, date });
      if (!log || log.glasses < 4) {
        await createIfNotExists({
          user: user._id,
          title: "Water reminder",
          message: "Halfway through the day — remember to stay hydrated! 💧",
          type: "general",
        });
      }
    }
  });

  cron.schedule("0 19 * * *", async () => {
    const users = await User.find({ "notificationPrefs.waterReminder": true }, "_id");
    const date = todayStr();
    for (const user of users) {
      const log = await WaterLog.findOne({ user: user._id, date });
      if (!log || log.glasses < 6) {
        await createIfNotExists({
          user: user._id,
          title: "Water reminder",
          message: `You've had ${log?.glasses ?? 0} glasses today. Try to reach 8! 💧`,
          type: "general",
        });
      }
    }
  });
};

// Every 30 min — meal reminders based on user-configured times
const scheduleMealReminders = () => {
  cron.schedule("*/30 * * * *", async () => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${now.getMinutes() < 30 ? "00" : "30"}`;

    const meals = ["breakfast", "lunch", "dinner"];
    const mealLabels = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner" };

    for (const meal of meals) {
      const users = await User.find({
        [`notificationPrefs.mealReminders.${meal}.enabled`]: true,
        [`notificationPrefs.mealReminders.${meal}.time`]: currentTime,
      });
      for (const user of users) {
        await createIfNotExists({
          user: user._id,
          title: `${mealLabels[meal]} reminder`,
          message: `Time for ${mealLabels[meal].toLowerCase()}! Don't forget to log your meal.`,
          type: "general",
        });
      }
    }
  });
};

module.exports = { scheduleCaloriesReminder, scheduleCaloriePacing, scheduleWaterReminders, scheduleMealReminders };
