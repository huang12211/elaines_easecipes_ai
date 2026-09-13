import {EMBEDDING_MODEL, CHAT_MODEL, CHAT_SYSTEM_PROMPT_NAME, RERANKING_MODEL } from "@/constants";
import { streamText, convertToModelMessages, UIMessage, embed, toUIMessageStream, createUIMessageStreamResponse, rerank } from "ai";
import { after } from "next/server";
import { observe, propagateAttributes, startActiveObservation, updateActiveObservation } from "@langfuse/tracing";
import { context as otelContext, trace } from "@opentelemetry/api";
import { db } from "@/lib/db";
import { recipeEmbeddings } from "@/lib/db/schema";
import { langfuseSpanProcessor } from "@/instrumentation";
import { langfuseClient } from "@/lib/langfuse";

const FALLBACK_SYSTEM_PROMPT = `
You are a helpful assistant named Pitaya Pal.
Only answer questions about content that can be found on https://elaineseasecipes.com/.
For anything outside of that, respond with "Sorry, I can only answer questions about content that can be found on Elaine's Easecipes".
When asked to provide recipes, only provide those found in the context provided below.
{{context}}
Each listed recipe should include the recipe name hyperlinked to the recipe's url using the format [text](url).
The url should be the slug of the recipe appended to "https://elaineseasecipes.com/recipes/".
For example, if the slug is "best-chocolate-chip-cookies", you should list it as: [Best Chocolate Chip Cookies](https://elaineseasecipes.com/recipes/best-chocolate-chip-cookies).
If the context is empty, respond with "Sorry, I couldn't find any recipes that match your query on Elaine's Easecipes.".
Keep responses concise and friendly.
`;

export const dynamic = 'force-dynamic';

export const maxDuration = 30;

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (normA * normB);
}

function tokenize(text: string): string[] {
  return text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

const BM25_K1 = 1.5;
const BM25_B = 0.75;

function bm25Rank<T extends { content: string }>(query: string, documents: T[]): (T & { bm25Score: number })[] {
  const queryTerms = tokenize(query);
  const docTerms = documents.map(doc => tokenize(doc.content));
  const docLengths = docTerms.map(terms => terms.length);
  const avgDocLength = docLengths.reduce((sum, len) => sum + len, 0) / (documents.length || 1);

  const docFrequency = new Map<string, number>();
  for (const term of new Set(queryTerms)) {
    docFrequency.set(term, docTerms.filter(terms => terms.includes(term)).length);
  }

  return documents
    .map((doc, i) => {
      const terms = docTerms[i];
      const docLength = docLengths[i];

      const bm25Score = queryTerms.reduce((sum, term) => {
        const df = docFrequency.get(term) ?? 0;
        const idf = Math.log((documents.length - df + 0.5) / (df + 0.5) + 1);
        const termFrequency = terms.filter(t => t === term).length;
        const numerator = termFrequency * (BM25_K1 + 1);
        const denominator = termFrequency + BM25_K1 * (1 - BM25_B + BM25_B * (docLength / avgDocLength));
        return sum + idf * (numerator / (denominator || 1));
      }, 0);

      return { ...doc, bm25Score };
    })
    .sort((a, b) => b.bm25Score - a.bm25Score);
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

      const topRecipes = await startActiveObservation(
        "retrieve-relevant-content",
        async (chain) => {
          chain.update({ input: query });

          const { embedding: queryEmbedding } = await startActiveObservation(
            "embed-query",
            async (embedding) => {
              embedding.update({ input: query });

              const result = await embed({
                model: EMBEDDING_MODEL,
                value: query,
                telemetry: { isEnabled: false },
              });

              embedding.update({ output: result.embedding });

              return result;
            },
            { asType: "embedding" }
          );

          const recipes= startActiveObservation(
            "retrieve-recipes",
            (retriever) => {
              retriever.update({ input: query});

              const allEmbeddings = db.select().from(recipeEmbeddings).all();

              const resultsFromBruteForceCosineSimilaritySearch = allEmbeddings
                .map(row => ({
                  content: row.content,
                  score: cosineSimilarity(queryEmbedding, JSON.parse(row.embedding) as number[]),
                }))
                .sort((a, b) => b.score - a.score)
                .slice(0, 10);
              
  
              const resultsFromBM25Ranking = bm25Rank(query, allEmbeddings.map(row => ({ content: row.content })))
                .map(doc => ({ content: doc.content, score: doc.bm25Score }))
                .slice(0, 10);
              
              const combinedResults = [...new Map(
                [...resultsFromBM25Ranking, ...resultsFromBruteForceCosineSimilaritySearch].map(r => [r.content, r])
              ).values()]

              retriever.update({ output: combinedResults });

              return combinedResults;
            },
            { asType: "retriever" }
          );

          const rerankedRecipes = await startActiveObservation(
            "rank-retrieved-results",
            async (ranker) => {
              ranker.update({ input: query });

              const { rerankedDocuments } = await rerank({
                model: RERANKING_MODEL,
                documents: recipes,
                query,
                topN: 10,
                telemetry: { isEnabled: false },
              });

              ranker.update({ output: rerankedDocuments });

              return rerankedDocuments;
            },
            { asType: "generation" }
          );

          chain.update({ output: rerankedRecipes });

          return rerankedRecipes;
        },
        { asType: "chain" }
      );

      const context = topRecipes.map(r => r.content).join('\n\n---\n\n');

      const systemPrompt = await langfuseClient.prompt.get(CHAT_SYSTEM_PROMPT_NAME, {
        label: "production",
        type: "text",
        fallback: FALLBACK_SYSTEM_PROMPT,
      });

      const result = streamText({
        model: CHAT_MODEL,
        temperature: 0.1,
        system: systemPrompt.compile({ context }),
        messages: await convertToModelMessages(messages),
        runtimeContext: {
          langfusePrompt: {
            name: systemPrompt.name,
            version: systemPrompt.version,
            isFallback: systemPrompt.isFallback,
          },
        },
        telemetry: {
          functionId: "chat-completion",
          includeRuntimeContext: { langfusePrompt: true },
        },
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
  name: "rag-chat-pipeline",
  endOnExit: false,
  captureInput: false,
});
