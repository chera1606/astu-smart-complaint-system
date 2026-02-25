import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");
import { chunkText } from "../../utils/chunk.js";
import { getGeminiEmbedding } from "../../utils/embedData.js";
import { KnowledgeBase } from "../../model/knowledge.model.js";

export const uploadDataService = {
    /**
     * Extracts text from buffer, chunks it, embeds it, and saves to KnowledgeBase.
     * Supports PDF and Plain Text.
     */
    async upload(file, sourceName) {
        try {
            let text = "";

            // 1. Extract Text
            if (file.mimetype === "application/pdf") {
                const data = await pdf(file.buffer);
                text = data.text;
            } else if (file.mimetype === "text/plain") {
                text = file.buffer.toString("utf-8");
            } else {
                throw new Error("Unsupported file type. Please upload PDF or TXT.");
            }

            if (!text.trim()) {
                throw new Error("No readable text found in the document.");
            }

            // 2. Chunk the text (RecursiveCharacterTextSplitter)
            const chunks = await chunkText(text);
            if (!chunks || chunks.length === 0) {
                throw new Error("Failed to split text into chunks.");
            }

            // 3. Generate embeddings
            console.log(`Generating embeddings for ${chunks.length} chunks...`);
            const embeddingResult = await getGeminiEmbedding(chunks, true);
            if (!embeddingResult.success) {
                throw new Error(embeddingResult.error);
            }

            const vectors = embeddingResult.data;

            // 4. Prepare and save documents
            const documents = chunks.map((chunk, index) => ({
                content: chunk,
                embedding: vectors[index],
                metadata: {
                    source: "admin-upload",
                    fileName: sourceName || file.originalname,
                    fileType: file.mimetype,
                    chunkIndex: index,
                    uploadedAt: new Date()
                }
            }));

            const saved = await KnowledgeBase.insertMany(documents);

            return {
                success: true,
                data: {
                    count: saved.length,
                    fileName: file.originalname,
                    message: `Successfully indexed ${saved.length} chunks from ${file.originalname}`
                }
            };

        } catch (error) {
            console.error("Upload Service Error:", error);
            return {
                success: false,
                error: error.message || "An unexpected error occurred during document processing"
            };
        }
    }
};
