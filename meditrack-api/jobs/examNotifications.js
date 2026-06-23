const cron = require("node-cron");
const Exam = require("../models/Exam");
const { createIfNotExists } = require("../services/notificationService");

const scheduleExamNotifications = () => {
  cron.schedule("0 8 * * *", async () => {
    console.log("[CRON] Checking exam notifications...");

    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Upcoming exams within 7 days
    const upcomingExams = await Exam.find({
      nextDate: { $gte: now, $lte: in7Days },
      reminderSent: false,
    }).populate("user", "notificationPrefs");

    for (const exam of upcomingExams) {
      if (exam.user?.notificationPrefs?.exams === false) continue;

      const daysUntil = Math.ceil(
        (new Date(exam.nextDate) - now) / (1000 * 60 * 60 * 24)
      );
      await createIfNotExists({
        user: exam.user._id,
        title: "Upcoming appointment",
        message: `You have "${exam.name}" scheduled in ${daysUntil} ${daysUntil === 1 ? "day" : "days"}.`,
        type: "appointment",
      });
      await Exam.findByIdAndUpdate(exam._id, { reminderSent: true });
    }

    // Overdue exams — nextDate has passed, user not yet notified
    const overdueExams = await Exam.find({
      nextDate: { $lt: now },
      recommendationNotified: false,
    }).populate("user", "notificationPrefs");

    for (const exam of overdueExams) {
      if (exam.user?.notificationPrefs?.exams === false) continue;

      const daysOverdue = Math.floor(
        (now - new Date(exam.nextDate)) / (1000 * 60 * 60 * 24)
      );
      await createIfNotExists({
        user: exam.user._id,
        title: "Exam overdue",
        message: `"${exam.name}" was due ${daysOverdue} ${daysOverdue === 1 ? "day" : "days"} ago. Consider booking an appointment.`,
        type: "reminder",
      });
      await Exam.findByIdAndUpdate(exam._id, { recommendationNotified: true });
    }

    console.log(`[CRON] Done: ${upcomingExams.length} upcoming, ${overdueExams.length} overdue.`);
  });
};

module.exports = { scheduleExamNotifications };
