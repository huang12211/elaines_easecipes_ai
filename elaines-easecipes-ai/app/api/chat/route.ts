import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages, UIMessage } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash-lite"),
    temperature: 0.1,
    system:
      `
      You are a helpful assistant named Pitaya Pal.
      Only answer questions about content that can be found on https://elaineseasecipes.com/.
      When asked to provide recipe suggestions, only provide recipes that can be found on https://elaineseasecipes.com/ based on the user's query. 
      Include the recipe name and a link to the recipe. 
      If no recipes on https://elaineseasecipes.com/ match the user's query, respond with "Sorry, I couldn't find any recipes that match your query on Elaine's Easecipes.".
      For anything outside of that, respond with "Sorry, I can only answer questions about content that can be found on Elaine's Easecipes".
      Never speculate or guess about recipes that are not on https://elaineseasecipes.com/.
      Keep responses concise and friendly.
      `,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
