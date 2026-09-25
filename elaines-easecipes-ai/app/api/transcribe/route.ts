import { TRANSCRIPTION_MODEL } from "@/constants";
import { transcribe } from "ai";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof Blob)) {
    return Response.json({ error: "Missing audio file" }, { status: 400 });
  }

  try {
    const { text } = await transcribe({
      model: TRANSCRIPTION_MODEL,
      audio: new Uint8Array(await file.arrayBuffer()),
    });

    return Response.json({ text });
  } catch (error) {
    console.error("Transcription failed:", error);
    return Response.json({ error: "Transcription failed" }, { status: 500 });
  }
}
