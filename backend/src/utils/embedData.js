import { genAI } from "../config/genAI.js";

/**
 * Generates embeddings for an array of text chunks.
 * Handles batching to avoid API limits.
 */
export async function getGeminiEmbedding(chunks, isAddingData = true, batchSize = 20) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
        const vectors = [];

        for (let i = 0; i < chunks.length; i += batchSize) {
            const batch = chunks.slice(i, i + batchSize);

            const result = await model.batchEmbedContents({
                requests: batch.map((text) => ({
                    content: { parts: [{ text }] },
                    taskType: isAddingData ? "RETRIEVAL_DOCUMENT" : "RETRIEVAL_QUERY",
                })),
            });

            if (!result.embeddings) {
                return { success: false, error: "Empty batch embedding response" };
            }

            vectors.push(...result.embeddings.map(e => e.values));
        }

        return { success: true, data: vectors };
    } catch (error) {
        console.error("Batch embedding error:", error);
        return { success: false, error: "Failed to generate batch embeddings: " + (error.message || "") };
    }
}
