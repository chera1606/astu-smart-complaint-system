import { genAI } from "../config/genAI.js";

/**
 * Embeds a single query string for vector search.
 */
export const embedGeneratedQuery = async (query) => {
    try {
        if (!query) return { success: false, error: "Query is required" };

        const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

        const result = await model.embedContent({
            content: { parts: [{ text: query }] },
            taskType: "RETRIEVAL_QUERY"
        });

        if (!result.embedding?.values) {
            return { success: false, error: "Empty embedding generated" };
        }

        return {
            success: true,
            vector: result.embedding.values
        };

    } catch (error) {
        console.error("Query embedding error:", error);
        return { success: false, error: error?.message || "Embedding failed" };
    }
};
