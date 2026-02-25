import express from "express";
import multer from "multer";
import { uploadDataController } from "./upload.controller.js";
import { protect, admin } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Configure multer for memory storage (we process buffer directly)
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Admin-only document upload for RAG
router.post("/", protect, admin, upload.single("file"), uploadDataController.handleUpload);

export default router;
