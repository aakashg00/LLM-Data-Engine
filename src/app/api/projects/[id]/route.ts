import { NextRequest, NextResponse } from "next/server";
import { Annotation, PrismaClient, Tag } from "@prisma/client";
import { AnnotationType } from "~/app/_components/Annotate/AnnotatePage";

import { fieldEncryptionExtension } from "prisma-field-encryption";

const globalClient = new PrismaClient();

export const client = globalClient.$extends(
  fieldEncryptionExtension({
    encryptionKey: process.env.PRISMA_FIELD_ENCRYPTION_KEY,
  }),
);

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  try {
    const project = await client.project.findUnique({
      where: {
        id,
      },
      include: {
        systemPrompts: true,
        users: true,
      },
    });

    if (!project) {
      return new NextResponse("Project with ID does not exist", {
        status: 404,
      });
    } else {
      return NextResponse.json(project);
    }
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.error();
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  try {
    const { name, systemPrompts, description, annotation, instructions } =
      (await req.json()) as {
        name: string;
        systemPrompts: { title: string; body: string }[];
        description: string;
        annotation: AnnotationType;
        instructions: string;
      };

    // tags.map((tag) => ({
    //   where: { name: tag.name }, // Use where clause to find existing tags by name
    //   create: {
    //     name: tag.name,
    //     color: tag.color,
    //   },
    // }));

    const updatedProject = await client.project.update({
      where: { id },
      data: {
        name,
        description,
        annotation,
        instructions,
        systemPrompts: {
          deleteMany: {}, // Remove all existing system prompts
          create: systemPrompts.map((prompt) => ({
            title: prompt.title,
            body: prompt.body,
          })),
        },
      },
      include: { systemPrompts: true },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.error();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = params.id;

  try {
    // Find all messages associated with conversations belonging to the project
    const messages = await client.message.findMany({
      where: {
        conversation: {
          projectId: id,
        },
      },
      select: {
        id: true,
      },
    });

    // Extract message IDs from the found messages
    const messageIds = messages.map((message) => message.id);

    // Delete AI responses associated with the found message IDs
    await client.aI_Response.deleteMany({
      where: {
        messageId: {
          in: messageIds,
        },
      },
    });

    // Delete messages associated with the found conversation IDs
    await client.message.deleteMany({
      where: {
        id: {
          in: messageIds,
        },
      },
    });

    // Delete conversations associated with the project
    await client.conversation.deleteMany({
      where: {
        projectId: id,
      },
    });

    // Delete system prompts associated with the project
    await client.systemPrompt.deleteMany({
      where: {
        projectId: id,
      },
    });

    // Delete the project itself
    await client.project.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Project and associated data deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project and associated data:", error);
    return NextResponse.error();
  }
}
