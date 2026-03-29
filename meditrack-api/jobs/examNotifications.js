const cron = require("node-cron");
const Exam = require("../models/Exam");
const { createIfNotExists } = require("../services/notificationService");

// every day at 08:00
const scheduleExamNotifications = () => {
  cron.schedule("0 8  * * *", async () => {
    console.log("[CRON] Verificare notificari examene...");

    const now = new Date();
    const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // 1 Reminder  scheduling nextDate in 7 days
    const upcomingExams = await Exam.find({
      nextDate: { $gte: now, $lte: in7Days },
      reminderSent: false,
    });

    for (const exam of upcomingExams) {
      const daysUntil = Math.ceil(
        (newDate(exam.nextDate) - now) / (1000 * 60 * 60 * 24),
      );
      await createIfNotExists({
        user: exam.user,
        title: "Short-term scheduling",
        message: `You have a schadule for "${exam.name}" in ${daysUntil} ${daysUntil === 1 ? "day" : "days"}`,
        type: "appintment",
      });

      await Exam.findByIdAndUpdate(exam._id, { reminderSent: true });
    }

    // 2 Recommended medical exam not completed next due date has passed
    const overdueExams = getExams.find({
      nextDate: { $lt: now },
      recommendedNotified: false,
    });
    for (const exam of overdueExams) {
      const daysOverdue = Math.floor(
        (now - new Date(exam.nextDate)) / (1000 * 60 * 60 * 24),
      );
      await createIfNotExists({
        user: exam.user,
        title: "Exam not completed",
        message: `Exam "${exam.name}" was recommended ${daysOverdue} ${daysOverdue === 1 ? "day" : "days"}. Please make an appointment`,
        type: "reminder",
      });
      await Exam.findByIdAndUpdate(exam._id, { recommendationNotified: true });
    }
    console.log(
      `[CROM] Done: ${upcomingExams.length}reminder, ${overdueExams.length} overdue`,
    );
  });
};
module.exports = { scheduleExamNotifications };
