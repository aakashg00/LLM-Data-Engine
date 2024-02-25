import getLangfuseClient from "~/app/langfuse";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as unknown;
    const {
      traceId,
      parentObservationId,
      name,
      metadata,
      input,
      output,
      projectId,
    } = data as {
      traceId: string;
      parentObservationId?: string;
      name?: string;
      metadata?: Record<string, unknown>;
      input?: unknown;
      output?: unknown;
      projectId: string;
    };

    const langfuse = await getLangfuseClient(projectId);

    if (!langfuse) {
      return new NextResponse("Langfuse client not available", { status: 400 });
    } else {
      const event = langfuse.event({
        traceId,
        parentObservationId,
        name,
        metadata,
        input,
        output,
      });
      return NextResponse.json({ id: event.id });
    }
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.error();
  }
}
