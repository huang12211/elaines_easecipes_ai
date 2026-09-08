import type { LangfuseSpanProcessor as LangfuseSpanProcessorType } from "@langfuse/otel";

export let langfuseSpanProcessor: LangfuseSpanProcessorType;

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { LangfuseSpanProcessor } = await import("@langfuse/otel");
  const { LangfuseVercelAiSdkIntegration } = await import("@langfuse/vercel-ai-sdk");
  const { NodeTracerProvider } = await import("@opentelemetry/sdk-trace-node");
  const { registerTelemetry } = await import("ai");

  langfuseSpanProcessor = new LangfuseSpanProcessor();

  const tracerProvider = new NodeTracerProvider({
    spanProcessors: [langfuseSpanProcessor],
  });

  tracerProvider.register();
  registerTelemetry(new LangfuseVercelAiSdkIntegration());
}
