import {EMBEDDING_MODEL, CHAT_MODEL } from "@/constants";
import { streamText, convertToModelMessages, UIMessage, embed, toUIMessageStream, createUIMessageStreamResponse } from "ai";
import { after } from "next/server";
import { observe, propagateAttributes, startActiveObservation, updateActiveObservation } from "@langfuse/tracing";
import { context as otelContext, trace } from "@opentelemetry/api";
import { db } from "@/lib/db";
import { recipeEmbeddings } from "@/lib/db/schema";
import { langfuseSpanProcessor } from "@/instrumentation";

export const dynamic = 'force-dynamic';

export const maxDuration = 30;

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (normA * normB);
}

const handler = async (req: Request) => {
  const { messages, id }: { messages: UIMessage[]; id: string } = await req.json();

  const latestUserMsg = messages.filter(m => m.role === 'user').at(-1);
  const query = latestUserMsg?.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map(p => p.text)
    .join(' ') ?? '';

  updateActiveObservation({ input: query });

  return propagateAttributes(
    { traceName: "chat-message", sessionId: id, tags: ["chat"] },
    async () => {
      // Captured because onFinish/onError run after the request's own OTel
      // context has exited, when trace.getActiveSpan() would resolve to a
      // different (already-ended) inner span from the AI SDK's own tracing.
      const rootSpan = trace.getActiveSpan();

      const { embedding: queryEmbedding } = await embed({
        model: EMBEDDING_MODEL,
        value: query,
        telemetry: { functionId: "embed-query" },
      });

      const topRecipes = startActiveObservation(
        "retrieve-recipes",
        (retriever) => {
          retriever.update({ input: query });

          const allEmbeddings = db.select().from(recipeEmbeddings).all();

          const recipes = allEmbeddings
            .map(row => ({
              content: row.content,
              score: cosineSimilarity(queryEmbedding, JSON.parse(row.embedding) as number[]),
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);

          retriever.update({ output: recipes });

          return recipes;
        },
        { asType: "retriever" }
      );

      const context = topRecipes.map(r => r.content).join('\n\n---\n\n');

      const result = streamText({
        model: CHAT_MODEL,
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
        telemetry: { functionId: "chat-completion" },
        onFinish: async ({ text }) => {
          if (!rootSpan) return;
          otelContext.with(trace.setSpan(otelContext.active(), rootSpan), () => {
            updateActiveObservation({ output: text });
          });
          rootSpan.end();
        },
        onError: async ({ error }) => {
          if (!rootSpan) return;
          otelContext.with(trace.setSpan(otelContext.active(), rootSpan), () => {
            updateActiveObservation({ output: String(error) });
          });
          rootSpan.end();
        },
      });

      after(async () => await langfuseSpanProcessor.forceFlush());

      return createUIMessageStreamResponse({
        stream: toUIMessageStream({
          stream: result.stream,
          onError: () => "Uh oh, I've used up all my tokens, Please come back another time.",
        }),
      });
    }
  );
};

export const POST = observe(handler, {
  name: "handle-chat-message",
  endOnExit: false,
  captureInput: false,
});
