import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import path from "path";
import { fileURLToPath } from "url";
import router from "./route.js"

import { ConnectDB } from "./config/mongo.js";

dotenv.config()
ConnectDB()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000
const app = express()
app.use(cors())
app.use(express.json())

// Serve uploaded files as static assets
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get("/", (req, res) => {
    res.send("HELLO from Backend!")
})

app.use("/api", router)

app.listen(PORT, () => {
    console.log(`🚀 server is running on: http://localhost:${PORT}`)
})
