const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const examRoutes = require("./routes/examRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Cron jobs
const { scheduleExamNotifications } = require("./jobs/examNotifications");
const { scheduleCaloriesReminder } = require("./jobs/caloriesNotifications");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/auth", authRoutes);
app.use("/exams", examRoutes);
app.use("/notifications", notificationRoutes);

// Start cron jobs after connecting to DB
scheduleExamNotifications();
scheduleCaloriesReminder();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
