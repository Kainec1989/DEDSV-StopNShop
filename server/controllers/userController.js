import bcryptjs from "bcryptjs";
import User from "../models/User.js";
import { AppError } from "../utils/AppError.js";

export const getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    throw new AppError("Missing required user fields", 400);
  }

  if (!["user", "admin"].includes(role)) {
    throw new AppError("Invalid role", 400);
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError("User with this email already exists", 409);
  }

  const hashedPassword = await bcryptjs.hash(password, 12);
  const newUser = new User({ name, email, password: hashedPassword, role });
  await newUser.save();

  const safe = newUser.toObject();
  delete safe.password;

  res.status(201).json({ message: "User created successfully", user: safe });
};


export const deleteUser = async (req, res) => {
  const deleted = await User.findByIdAndDelete(req.params.id);
  if (!deleted) {
    throw new AppError("User not found", 404);
  }
  res.json({ message: "User deleted successfully" });
};