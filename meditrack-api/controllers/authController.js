const crypto = require("crypto");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../services/sendEmail");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (userId, expiresIn = "7d") => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn });
};

const sendVerificationEmail = async (email, rawToken) => {
  const verifyUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify-email/${rawToken}`;
  await sendEmail({
    to: email,
    subject: "MediTrack – Verify your email",
    html: `
      <p>Welcome to MediTrack!</p>
      <p>Please verify your email address by clicking the link below. The link expires in <strong>24 hours</strong>.</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>If you didn't create an account, you can ignore this email.</p>
    `,
  });
};

// Register user — returns message, no auto-login (email verification required)
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already in use" });

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashed = crypto.createHash("sha256").update(rawToken).digest("hex");

    const user = await User.create({
      name,
      email,
      password,
      isEmailVerified: false,
      emailVerifyToken: hashed,
      emailVerifyExpire: Date.now() + 24 * 60 * 60 * 1000,
    });

    try {
      await sendVerificationEmail(email, rawToken);
    } catch (emailErr) {
      // If email fails, delete the user so they can try again after fixing email config
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({ message: "Failed to send verification email. Please try again later." });
    }

    res.status(201).json({ message: "Account created. Please check your email to verify your account." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Resend verification email
const resendVerification = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.isEmailVerified) {
      // Don't reveal whether email exists or is already verified
      return res.json({ message: "If that email exists and is unverified, a new link has been sent." });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashed = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.emailVerifyToken = hashed;
    user.emailVerifyExpire = Date.now() + 24 * 60 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    await sendVerificationEmail(email, rawToken);

    res.json({ message: "If that email exists and is unverified, a new link has been sent." });
  } catch (err) {
    res.status(500).json({ message: "Failed to send email. Please try again later." });
  }
};

// Verify email token
const verifyEmail = async (req, res) => {
  const hashed = crypto.createHash("sha256").update(req.params.token).digest("hex");

  try {
    const user = await User.findOne({
      emailVerifyToken: hashed,
      emailVerifyExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification link." });
    }

    user.isEmailVerified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.json({ message: "Email verified successfully. You can now sign in." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Existing users (before email verification was added) can still log in
    if (user.isEmailVerified === false) {
      return res.status(401).json({ message: "Please verify your email before signing in." });
    }

    const expiresIn = rememberMe ? "7d" : "1h";

    res.json({
      user: { id: user._id, name: user.name, email: user.email },
      token: generateToken(user._id, expiresIn),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Google OAuth — verifies the Google ID token sent from the frontend
const googleAuth = async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, email_verified } = payload;

    if (!email_verified) {
      return res.status(400).json({ message: "Google account email is not verified." });
    }

    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        user.googleId = googleId;
        user.isEmailVerified = true;
        await user.save({ validateBeforeSave: false });
      } else {
        user = await User.create({
          name,
          email,
          googleId,
          isEmailVerified: true,
        });
      }
    }

    res.json({
      user: { id: user._id, name: user.name, email: user.email },
      token: generateToken(user._id, "7d"),
    });
  } catch (err) {
    res.status(400).json({ message: "Google sign-in failed. Please try again." });
  }
};

// Change password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete account
const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: "Account deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: "If that email exists, a reset link has been sent." });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashed = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetPasswordToken = hashed;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${rawToken}`;

    await sendEmail({
      to: user.email,
      subject: "MediTrack – Reset your password",
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to set a new password. The link expires in <strong>10 minutes</strong>.</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    });

    res.json({ message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  const hashed = crypto.createHash("sha256").update(req.params.token).digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset link." });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  registerUser,
  resendVerification,
  verifyEmail,
  loginUser,
  googleAuth,
  changePassword,
  deleteAccount,
  forgotPassword,
  resetPassword,
};
