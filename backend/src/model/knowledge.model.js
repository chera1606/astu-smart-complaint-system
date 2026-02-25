import mongoose from "mongoose";

const KnowledgeBaseSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, "Content text is required!"],
        trim: true
    },
    embedding: {
        type: [Number],
        required: [true, "Embedding vector is required!"],
        index: true // Optional: for regular searches, but we use Atlas Vector Search
    },
    metadata: {
        source: { type: String, default: "manual-entry" },
        fileName: { type: String },
        fileType: { type: String },
        chunkIndex: { type: Number },
        uploadedAt: { type: Date, default: Date.now }
    }
}, { timestamps: true });

// We explicitly name the collection to ensure alignment with Atlas Vector Search index
export const KnowledgeBase = mongoose.model("KnowledgeBase", KnowledgeBaseSchema, "knowledgebases");
