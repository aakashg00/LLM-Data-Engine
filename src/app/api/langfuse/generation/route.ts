import getLangfuseClient from "~/app/langfuse";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as unknown;
    const { id, traceId, statusMessage, metadata, projectId } = data as {
      id: string;
      traceId: string;
      statusMessage?: string;
      metadata?: Record<string, unknown>;
      projectId: string;
    };

    const langfuse = await getLangfuseClient(projectId);

    if (!langfuse) {
      // Custom error response for langfuse client not available
      return new NextResponse("Langfuse client not available", { status: 400 });
    } else {
      // Update the generation
      langfuse.generation({
        id,
        traceId,
        statusMessage,
        metadata,
      });
      await langfuse.shutdownAsync();

      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("Error updating generation:", error);
    return new NextResponse("Error updating generation", { status: 500 });
  }
}
