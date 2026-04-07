const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  getDayLog,
  getHistory,
  addEntry,
  updateGoal,
  deleteEntry,
} = require("../controllers/calorieController");

router.use(protect);

router.get("/", getDayLog);
router.get("/history", getHistory);

router.post("/", addEntry);

router.patch("/:date/goal", updateGoal);

router.delete("/:date/meals/:mealType/entries/:entryId", deleteEntry);

module.exports = router;
