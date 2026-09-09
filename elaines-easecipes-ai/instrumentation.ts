import { LangfuseSpanProcessor } from "@langfuse/otel";
import { LangfuseVercelAiSdkIntegration } from "@langfuse/vercel-ai-sdk";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { registerTelemetry } from "ai";

export const langfuseSpanProcessor = new LangfuseSpanProcessor();

export function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const tracerProvider = new NodeTracerProvider({
    spanProcessors: [langfuseSpanProcessor],
  });

  tracerProvider.register();
  registerTelemetry(new LangfuseVercelAiSdkIntegration());
}
