import express from "express";
import mongoose, { connect } from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import connectDB from "./config/db.js";
import chalk from "chalk";
import User from "./models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { verifyToken } from "./middleware/verifyToken.js";
import stripePaymentRoutes from "./routes/stripePayment.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import chatbotRoutes from "./routes/chatbotRoute.js";
import bodyParser from "body-parser";
import cartRoute from "./routes/cartRoute.js";
import userRoutes from "./routes/userRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";

//Config
dotenv.config();
const app = express();

// Port
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
 "http://localhost:3000",
  "https://dedsv-stopnshop.onrender.com",
  "https://dedsv-stopnshop-client.onrender.com"
];

app.use(cors({ 
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", stripePaymentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", chatbotRoutes);
app.use("/api", cartRoute);
app.use("/api/users", userRoutes)
app.use("/api", accountRoutes);
app.use("/api", addressRoutes);

app.use(errorMiddleware);

//uptimeRobot monitor route
app.get("/health", (req, res) => {
  res.send("Server is healthy");
});

// Database connection
app.listen(PORT, () => {
  connectDB();
  console.log(chalk.bold.bgYellow(`Server listening on port: ${PORT}`));
});
