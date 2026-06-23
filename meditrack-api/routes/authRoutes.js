const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");

const {
  registerUser,
  resendVerification,
  verifyEmail,
  loginUser,
  googleAuth,
  changePassword,
  deleteAccount,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many requests. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  "/register",
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  validate,
  registerUser
);

router.get("/verify-email/:token", verifyEmail);

router.post(
  "/resend-verification",
  forgotPasswordLimiter,
  body("email").isEmail().withMessage("Invalid email address"),
  validate,
  resendVerification
);

router.post(
  "/login",
  loginLimiter,
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
  loginUser
);

router.post("/google", googleAuth);

router.put(
  "/change-password",
  protect,
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
  validate,
  changePassword
);

router.delete("/delete-account", protect, deleteAccount);

router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  body("email").isEmail().withMessage("Invalid email address"),
  validate,
  forgotPassword
);

router.put(
  "/reset-password/:token",
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  validate,
  resetPassword
);

module.exports = router;
