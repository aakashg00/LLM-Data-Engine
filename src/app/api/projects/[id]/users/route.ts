import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export async function POST(
  req: NextRequest,
  { params }: { params: { projectId: string } },
) {
  const projectId = params.projectId;
  try {
    const { userId } = (await req.json()) as { userId: string };

    const updatedProject = await client.project.update({
      where: { id: projectId },
      data: {
        users: {
          connect: { id: userId }, // Connect the user to the project
        },
      },
      include: { users: true }, // Include the updated users list in the response
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Error adding user to project:", error);
    return NextResponse.error();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { projectId: string } },
) {
  const projectId = params.projectId;
  try {
    const { userId } = (await req.json()) as { userId: string };

    const updatedProject = await client.project.update({
      where: { id: projectId },
      data: {
        users: {
          disconnect: { id: userId }, // Disconnect the user from the project
        },
      },
      include: { users: true }, // Include the updated users list in the response
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Error removing user from project:", error);
    return NextResponse.error();
  }
}
