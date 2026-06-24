const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { getActivities, addActivity, updateActivity, deleteActivity } = require("../controllers/activityController");

router.use(protect);

router.get("/", getActivities);

router.post(
  "/",
  body("name").trim().notEmpty().withMessage("Activity name is required"),
  body("duration").isInt({ min: 1 }).withMessage("Duration must be at least 1 minute"),
  body("caloriesBurned").isInt({ min: 0 }).withMessage("Calories burned must be 0 or more"),
  body("date").notEmpty().withMessage("Date is required"),
  validate,
  addActivity
);

router.patch("/:id", updateActivity);
router.delete("/:id", deleteActivity);

module.exports = router;
