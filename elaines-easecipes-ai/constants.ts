import { google } from "@ai-sdk/google";
import { cohere } from "@ai-sdk/cohere";

export const EMBEDDING_MODEL = google.embedding('gemini-embedding-001');
export const CHAT_MODEL = google("gemini-3.8-flash");
export const CHAT_SYSTEM_PROMPT_NAME = "chat-system-prompt";
export const RERANKING_MODEL = cohere.reranking("rerank-multilingual-v3.0");