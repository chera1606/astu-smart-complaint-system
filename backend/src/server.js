import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
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
app.use(helmet()); 
app.use(express.json({ limit: '10kb' })); 
// app.use(mongoSanitize()); // Disabled due to Express 5 incompatibility
app.use(hpp());

// 2. CORS CONFIGURATION
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

// 3. RATE LIMITING
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
})

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 20, // Restored to 20 per hour
    message: "Too many authentication attempts, please try again after an hour",
    standardHeaders: true,
    legacyHeaders: false,
})

app.use("/api", globalLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get("/", (req, res) => {
    res.send("ASTU Smart Complaint System API is running securely! 🛡️")
})

app.use("/api", router)

app.listen(PORT, () => {
    console.log(`🚀 server is running on: http://localhost:${PORT}`)
})
