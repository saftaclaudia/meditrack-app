const cron = require("node-cron");
const User = require("../models/User");
const { createIfNotExists } = require("../services/notificationService");

const scheduleCaloriesReminder = () => {
  cron.schedule("0 20 * * *", async () => {
    console.log("[CRON] Sending calorie reminders...");

    // Only send to users who have calories notifications enabled (or have no pref set = default true)
    const users = await User.find(
      { "notificationPrefs.calories": { $ne: false } },
      "_id"
    );

    for (const user of users) {
      await createIfNotExists({
        user: user._id,
        title: "Diet journal",
        message: "Don't forget to log today's calories.",
        type: "general",
      });
    }

    console.log(`[CRON] Calorie reminders sent to ${users.length} users.`);
  });
};

module.exports = { scheduleCaloriesReminder };
