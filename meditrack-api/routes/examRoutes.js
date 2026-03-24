const express = require("express");
const router = express.Router();

const {
  getExams,
  createExam,
  updateExam,
  deleteExam,
} = require("../controllers/examController");

const { protect } = require("../middleware/authMiddleware");
console.log("Exam routes loaded");
router.use(protect);

router.get("/", getExams);
router.post("/", createExam);
router.put("/:id", updateExam);
router.delete("/:id", deleteExam);

module.exports = router;
