const express = require("express");
const router = express.Router();
const { registerUser, loginUser, changePassword, deleteAccount, forgotPassword, resetPassword } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Change password route
router.put("/change-password", protect, changePassword);

// Delete account route
router.delete("/delete-account", protect, deleteAccount);

// Forgot / reset password
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

module.exports = router;
