import { genAI } from "../config/genAI.js";

/**
 * Summarizes the retrieved context to answer the user's query.
 * Strictly uses provided data only (Grounded RAG).
 */
export const summarizeResponse = async (query, context) => {
    try {
        if (!query || !context) {
            return {
                success: false,
                error: "Query and context are required for summarization"
            };
        }

        const prompt = `
You are the ASTU Smart Complaint System Assistant. 
Your task is to answer the user's question by using ONLY the provided knowledge context.

RULES:
- If the answer is not in the context, strictly say: "I am sorry, but I don't have information about that in the ASTU knowledge base. Please contact the administration."
- Do NOT use your own knowledge to answer.
- Keep the response professional and helpful.
- Use plain text without excessive formatting.

QUESTION: "${query}"

KNOWLEDGE CONTEXT:
---
${context}
---

ANSWER:`;

        const result = await genAI.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt
        });

        return {
            success: true,
            finalResponse: result.text
        };

    } catch (err) {
        console.error("Summarization error:", err);
        return {
            success: false,
            error: "Generation failed: " + (err.message || "Unknown error")
        };
    }
};
