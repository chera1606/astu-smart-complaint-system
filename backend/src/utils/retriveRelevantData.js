import { KnowledgeBase } from "../model/knowledge.model.js";

/**
 * Retrieves relevant context chunks from MongoDB Atlas Vector Search.
 * Strictly requires the 'vector_index' to be set up in Atlas.
 */
export const retrieveRelevantData = async (vector) => {
    try {
        if (!vector || !Array.isArray(vector)) {
            return { success: false, error: "Valid vector is required" };
        }

        // Atlas Vector Search aggregation
        const results = await KnowledgeBase.aggregate([
            {
                $vectorSearch: {
                    index: "vector_index",
                    path: "embedding",
                    queryVector: vector,
                    numCandidates: 100, // Search space
                    limit: 5 // Top matches
                }
            },
            {
                $project: {
                    _id: 0,
                    content: 1,
                    score: { $meta: "vectorSearchScore" }
                }
            }
        ]);

        if (!results || results.length === 0) {
            return { success: true, data: "" };
        }

        // Combine retrieved chunks into a single context string
        const context = results.map(r => r.content).join("\n\n---\n\n");

        return { success: true, data: context };

    } catch (error) {
        console.error("Vector Search Error:", error);
        return {
            success: false,
            error: "Context retrieval failed. Is 'vector_index' created in Atlas? " + error.message
        };
    }
};
