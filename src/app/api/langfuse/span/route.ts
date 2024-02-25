import getLangfuseClient from "~/app/langfuse";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as unknown;
    const { name, input, traceId, projectId } = data as {
      name: string;
      input?: unknown;
      traceId: string;
      projectId: string;
    };
    const langfuse = await getLangfuseClient(projectId);

    if (!langfuse) {
      // Custom error response for langfuse client not available
      return new NextResponse("Langfuse client not available", { status: 400 });
    } else {
      const span = langfuse.span({ name, input, traceId });
      await langfuse.shutdownAsync();
      return NextResponse.json({ id: span.id });
    }
  } catch (error) {
    console.error("Error creating trace:", error);
    return NextResponse.error();
  }
}
