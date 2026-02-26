import { genAI } from "../config/genAI.js";

/**
 * Generates embeddings for an array of text chunks.
 * Handles batching to avoid API limits.
 */
export async function getGeminiEmbedding(chunks, isAddingData = true, batchSize = 10) {
    try {
        const vectors = [];
        // Use gemini-embedding-001 via v1beta as confirmed by diagnostic tests
        const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" }, { apiVersion: 'v1beta' });

        for (let i = 0; i < chunks.length; i += batchSize) {
            const batch = chunks.slice(i, i + batchSize);

            // Process chunks in the batch
            const batchPromises = batch.map(text =>
                model.embedContent(text)
            );

            const results = await Promise.all(batchPromises);

            for (const result of results) {
                if (!result || !result.embedding?.values) {
                    throw new Error("Empty embedding response from Gemini API");
                }
                vectors.push(result.embedding.values);
            }

            // Subtle delay to avoid rate limiting if many chunks
            if (chunks.length > batchSize) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        return { success: true, data: vectors };
    } catch (error) {
        console.error("Gemini Embedding Error Details:", error);
        let errorMessage = error.message || "Unknown embedding error";
        if (errorMessage.includes("404")) errorMessage = "Model not found or API key invalid for this model.";
        if (errorMessage.includes("429")) errorMessage = "Rate limit exceeded. Please try again in a few minutes.";

        return { success: false, error: "AI Embedding Failed: " + errorMessage };
    }
}
