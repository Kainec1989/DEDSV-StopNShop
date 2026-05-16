import crypto from "node:crypto";
import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail } from "../mailtrap/emails.js";
import { sendWelcomeEmail } from "../mailtrap/emails.js";
import { sendPasswordResetEmail } from "../mailtrap/emails.js";
import { sendResetSuccessEmail } from "../mailtrap/emails.js";
import { AppError } from "../utils/AppError.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new AppError("Please fill all fields", 400);
  }

  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await bcryptjs.hash(password, 12);
  const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
  const user = new User({
    name,
    email,
    password: hashedPassword,
    verificationToken,
    verificationTokenExpireAt: Date.now() + 24 * 60 * 1000,
  });

  await user.save();
  generateTokenAndSetCookie(res, user._id);
  await sendVerificationEmail(user.email, verificationToken);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    user: { ...user._doc, password: undefined },
  });
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  const user = await User.findOne({
    verificationToken: code,
    verificationTokenExpireAt: { $gt: Date.now() },
  });
  if (!user) {
    throw new AppError("Invalid or expired verification code", 400);
  }
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpireAt = undefined;
  await user.save();

  await sendWelcomeEmail(user.email, user.name);

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
    user: { ...user._doc, password: undefined },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid credentials", 400);
  }

  const isPasswordValid = await bcryptjs.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 400);
  }

  const token = generateTokenAndSetCookie(res, user._id);

  user.lastLogin = new Date();
  await user.save();

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    token,
    user: {
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      lastLogin: user.lastLogin,
    },
  });
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
};

// Forgot password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpireAt = Date.now() + 3600000;
  await user.save();

  const clientBase = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");
  const resetUrl = `${clientBase}/reset-password/${resetToken}`;
  await sendPasswordResetEmail(user.email, resetUrl);

  res.status(200).json({ message: "Password reset email sent" });
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpireAt: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError("Invalid or expired token", 400);
  }

  const hashedPassword = await bcryptjs.hash(password, 12);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpireAt = undefined;
  await user.save();

  await sendResetSuccessEmail(user.email);

  res.status(200).json({ message: "Password reset successfully" });
};

//  user is authenticated

export const checkAuth = async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  if (!user) {
    throw new AppError("User not found", 400);
  }
  res.status(200).json({ success: true, user });
};


