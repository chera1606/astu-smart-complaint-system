import { genAI } from "../config/genAI.js";

/**
 * Generates embeddings for an array of text chunks.
 * Handles batching to avoid API limits.
 */
export async function getGeminiEmbedding(chunks, isAddingData = true, batchSize = 20) {
    try {
        const vectors = [];

        for (let i = 0; i < chunks.length; i += batchSize) {
            const batch = chunks.slice(i, i + batchSize);

            // Process each chunk individually (new SDK doesn't support batch for embedContent)
            for (const text of batch) {
                const result = await genAI.models.embedContent({
                    model: "gemini-embedding-001",
                    contents: text,
                    taskType: isAddingData ? "RETRIEVAL_DOCUMENT" : "RETRIEVAL_QUERY",
                });

                if (!result || !result.embedding?.values) {
                    return { success: false, error: "Empty embedding response" };
                }

                vectors.push(result.embedding.values);
            }
        }

        return { success: true, data: vectors };
    } catch (error) {
        console.error("Batch embedding error:", error);
        return { success: false, error: "Failed to generate batch embeddings: " + (error.message || "") };
    }
}
