import { LangfuseSpanProcessor } from "@langfuse/otel";
import { LangfuseVercelAiSdkIntegration } from "@langfuse/vercel-ai-sdk";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { registerTelemetry } from "ai";

// This file runs once at server startup and registers the Langfuse span processor and telemetry 
// integration for the Vercel AI SDK. It is imported in `app/layout.tsx` to ensure it runs before 
// any other code that may create spans.
export const langfuseSpanProcessor = new LangfuseSpanProcessor();

export function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;


  // Register the Langfuse span processor on an OpenTelemetry NodeTracerProvider for the Vercel AI SDK
  const tracerProvider = new NodeTracerProvider({
    spanProcessors: [langfuseSpanProcessor],
  });

  tracerProvider.register();
  registerTelemetry(new LangfuseVercelAiSdkIntegration());
}
