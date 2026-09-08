import { google } from "@ai-sdk/google";

export const EMBEDDING_MODEL = google.embedding('gemini-embedding-001');
export const CHAT_MODEL = google("gemini-3.8-flash");