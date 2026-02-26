import { embedGeneratedQuery } from "../../utils/embedQuery.js";
import { retrieveRelevantData } from "../../utils/retriveRelevantData.js";
import { summarizeResponse } from "../../utils/summarise.js";

export const ragService = {
    async query(userQuery) {
        try {
            // 1. Embed query
            console.log("RAG: Embedding query...");
            const embedResult = await embedGeneratedQuery(userQuery);
            if (!embedResult.success) {
                console.error("RAG: Embedding failed:", embedResult.error);
                return { success: false, error: embedResult.error };
            }

            // 2. Retrieve relevant data
            console.log("RAG: Retrieving relevant context...");
            const retrieveResult = await retrieveRelevantData(embedResult.vector);
            if (!retrieveResult.success) {
                console.error("RAG: Retrieval failed:", retrieveResult.error);
                return { success: false, error: retrieveResult.error };
            }

            if (!retrieveResult.data || retrieveResult.data.length === 0) {
                console.log("RAG: No relevant data found.");
                return {
                    success: true,
                    data: "I couldn't find any relevant information in my database to answer your question."
                };
            }

            // 3. Summarize answer
            console.log("RAG: Generating answer with AI...");
            const summarizeResult = await summarizeResponse(userQuery, retrieveResult.data);
            if (!summarizeResult.success) {
                console.error("RAG: Summarization failed:", summarizeResult.error);
                return { success: false, error: summarizeResult.error };
            }

            console.log("RAG: Success! Returning answer.");
            return {
                success: true,
                data: summarizeResult.finalResponse
            };

        } catch (error) {
            console.error("Error in ragService.query:", error);
            return {
                success: false,
                error: error.message || "An unexpected error occurred during RAG query"
            };
        }
    }
};
