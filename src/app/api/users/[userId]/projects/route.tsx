import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { fieldEncryptionExtension } from "prisma-field-encryption";

const globalClient = new PrismaClient();

export const client = globalClient.$extends(
  fieldEncryptionExtension({
    encryptionKey: process.env.PRISMA_FIELD_ENCRYPTION_KEY,
  }),
);

export async function GET(
  request: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const userId = params.userId;

    // Fetch projects for the specific user
    const userWithProjects = await client.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        projects: true,
      },
    });

    if (!userWithProjects) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userWithProjects.projects);
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return NextResponse.error();
  }
}

export async function POST(
  request: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const userId = params.userId;
    const { name, description, publicKey, secretKey } =
      (await request.json()) as {
        name: string;
        description: string;
        publicKey: string;
        secretKey: string;
      };

    // Check if user exists
    const user = await client.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create a new project and link it to the user
    const newProject = await client.project.create({
      data: {
        name,
        description,
        publicKey,
        secretKey,
        users: {
          connect: { id: userId },
        },
      },
    });

    return NextResponse.json(newProject);
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.error();
  }
}
