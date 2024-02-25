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
        systemPrompts: string[];
        description: string;
        annotation: AnnotationType;
        instructions: string;
        // tags: Tag[];
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
        systemPrompts,
        description,
        annotation,
        instructions,
      },
      // include: { tags: true }, // Include tags in the response
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.error();
  }
}
