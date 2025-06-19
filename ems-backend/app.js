import "dotenv/config.js";
import express from "express";
import path from "path";
import logger from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth/authRoutes.js";
import adminRoutes from "./routes/admin/adminRoutes.js";

// Set up the path for the current directory
const __dirname = path.resolve();

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Static files
app.use(express.static(path.join(__dirname + "public")));

// View engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("views", "views");

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(logger("common"));
app.use(cookieParser());

// CORS
app.use(cors());

// Define Routes
app.use("/api/auth", authRoutes); // User authentication routes
app.use("/api/admin", adminRoutes); // Admin-specific routes mounted under '/api/admin'

// Error handling middleware
app.use(errorHandler);

// Export the app for use in other modules
export default app;
