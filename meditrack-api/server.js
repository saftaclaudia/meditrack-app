const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const examRoutes = require("./routes/examRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const calorieRoutes = require("./routes/calorieRoutes");
const profileRoutes = require("./routes/profileRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const activityRoutes = require("./routes/activityRoutes");
const waterRoutes = require("./routes/waterRoutes");
const weightRoutes = require("./routes/weightRoutes");
const mealTemplateRoutes = require("./routes/mealTemplateRoutes");

// Cron jobs
const { scheduleExamNotifications } = require("./jobs/examNotifications");
const { scheduleCaloriesReminder, scheduleCaloriePacing, scheduleWaterReminders, scheduleMealReminders } = require("./jobs/caloriesNotifications");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"], credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/auth", authRoutes);
app.use("/exams", examRoutes);
app.use("/notifications", notificationRoutes);
app.use("/calories", calorieRoutes);
app.use("/profile", profileRoutes);
app.use("/recipes", recipeRoutes);
app.use("/activities", activityRoutes);
app.use("/water", waterRoutes);
app.use("/weight", weightRoutes);
app.use("/meal-templates", mealTemplateRoutes);

// Start cron jobs after connecting to DB
scheduleExamNotifications();
scheduleCaloriesReminder();
scheduleCaloriePacing();
scheduleWaterReminders();
scheduleMealReminders();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
