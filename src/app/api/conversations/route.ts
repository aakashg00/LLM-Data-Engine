import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export async function POST(req: NextRequest) {
  const { projectId } = (await req.json()) as { projectId: string };
  try {
    // Check if the project exists
    const project = await client.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    // Create a conversation associated with the project
    const newConversation = await client.conversation.create({
      data: {
        project: { connect: { id: projectId } },
      },
    });

    return NextResponse.json({ id: newConversation.id });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.error();
  }
}

export async function GET() {
  try {
    // await client.aI_Response.deleteMany({});
    // await client.message.deleteMany({});
    // await client.conversation.deleteMany({});
    // await client.project.deleteMany({});

    const conversations = await client.conversation.findMany({
      include: {
        messages: true,
      },
    });
    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.error();
  }
}
