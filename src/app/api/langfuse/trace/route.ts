import getLangfuseClient from "~/app/langfuse";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as unknown;
    const { id, name, input, output, sessionId, metadata, tags, projectId } =
      data as {
        id?: string;
        name?: string;
        input?: unknown;
        output?: unknown;
        sessionId?: string;
        metadata?: Record<string, unknown>;
        tags?: string[];
        projectId: string;
      };
    const langfuse = await getLangfuseClient(projectId);

    if (!langfuse) {
      // Custom error response for langfuse client not available
      return new NextResponse("Langfuse client not available", { status: 400 });
    } else {
      const trace = langfuse.trace({
        id,
        name,
        input,
        output,
        metadata,
        tags,
        sessionId,
      });
      await langfuse.shutdownAsync();
      return NextResponse.json({ id: trace.id });
    }
  } catch (error) {
    console.error("Error creating trace:", error);
    return NextResponse.error();
  }
}
