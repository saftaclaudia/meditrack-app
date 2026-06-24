const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getProfile,
  updateProfile,
  getMacroGoals,
  updateMacroGoals,
  getFavorites,
  addFavorite,
  removeFavorite,
} = require("../controllers/profileController");

router.use(protect);

router.get("/", getProfile);
router.patch("/", updateProfile);

router.get("/macros", getMacroGoals);
router.patch("/macros", updateMacroGoals);

router.get("/favorites", getFavorites);
router.post("/favorites", addFavorite);
router.delete("/favorites/:name", removeFavorite);

module.exports = router;
