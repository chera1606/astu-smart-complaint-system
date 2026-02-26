import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import { rateLimit } from "express-rate-limit";

import router from "./route.js"
import { ConnectDB } from "./config/mongo.js";

dotenv.config()
ConnectDB()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000
const app = express()

// 1. GLOBAL SECURITY MIDDLEWARES
app.use(helmet()); // Set secure HTTP headers
app.use(express.json({ limit: '10kb' })); // Body parser, with limit to prevent DOS
app.use(mongoSanitize()); // Data sanitization against NoSQL query injection
app.use(hpp()); // Prevent HTTP Parameter Pollution

// 2. CORS CONFIGURATION
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Restrict to your frontend
    credentials: true
}))

// 3. RATE LIMITING
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
})

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // Limit each IP to 20 login/register attempts per hour
    message: "Too many authentication attempts, please try again after an hour",
    standardHeaders: true,
    legacyHeaders: false,
})

// Apply global rate limiter
app.use("/api", globalLimiter);

// Apply strict limiter to auth routes (assuming they are under /api/users)
app.use("/api/users/login", authLimiter);
app.use("/api/users/register", authLimiter);

// Serve uploaded files as static assets
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get("/", (req, res) => {
    res.send("ASTU Smart Complaint System API is running securely! 🛡️")
})

app.use("/api", router)

app.listen(PORT, () => {
    console.log(`🚀 server is running on: http://localhost:${PORT}`)
})
