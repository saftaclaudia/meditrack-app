const cron = require("node-cron");
const User = require("../models/User");
const { createIfNotExists } = require("../services/notificationService");

const scheduleCaloriesReminder = () => {
  cron.schedule("0 20 * * *", async () => {
    console.log("[CRON] Send reminder calories...");

    const users = await User.find({}, "_id");

    for (const user of users) {
      await createIfNotExists({
        user: user._id,
        title: "Diet journal",
        message: "Don't forget to log today's calories.",
        type: "general",
      });
    }
    console.log(`[CRON] Reminder calories send to ${users.length} users`);
  });
};
module.exports = { scheduleCaloriesReminder };
