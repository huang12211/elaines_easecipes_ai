import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages, UIMessage, embed } from "ai";
import { db } from "@/lib/db";
import { recipeEmbeddings } from "@/lib/db/schema";

export const maxDuration = 30;

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (normA * normB);
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const latestUserMsg = messages.filter(m => m.role === 'user').at(-1);
  const query = latestUserMsg?.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map(p => p.text)
    .join(' ') ?? '';

  const { embedding: queryEmbedding } = await embed({
    model: google.embedding('gemini-embedding-001'),
    value: query,
  });

  const allEmbeddings = db.select().from(recipeEmbeddings).all();

  const topRecipes = allEmbeddings
    .map(row => ({
      content: row.content,
      score: cosineSimilarity(queryEmbedding, JSON.parse(row.embedding) as number[]),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const context = topRecipes.map(r => r.content).join('\n\n---\n\n');

  const result = streamText({
    model: google("gemini-2.5-flash-lite"),
    temperature: 0.1,
    system:
      `
      You are a helpful assistant named Pitaya Pal.
      Only answer questions about content that can be found on https://elaineseasecipes.com/.
      For anything outside of that, respond with "Sorry, I can only answer questions about content that can be found on Elaine's Easecipes".
      When asked to provide recipes, only provide those found in the context provided below.
      ${context}
      Each listed recipe should include the recipe name hyperlinked to the recipe's url using the format [text](url).
      The url should be the slug of the recipe appended to "https://elaineseasecipes.com/recipes/". 
      For example, if the slug is "best-chocolate-chip-cookies", you should list it as: [Best Chocolate Chip Cookies](https://elaineseasecipes.com/recipes/best-chocolate-chip-cookies).
      If the context is empty, respond with "Sorry, I couldn't find any recipes that match your query on Elaine's Easecipes.".
      Keep responses concise and friendly.
      `,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
