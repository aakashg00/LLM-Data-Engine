import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { fieldEncryptionExtension } from "prisma-field-encryption";

const globalClient = new PrismaClient();

export const client = globalClient.$extends(
  fieldEncryptionExtension({
    encryptionKey: process.env.PRISMA_FIELD_ENCRYPTION_KEY,
  }),
);

export async function POST(request: Request) {
  try {
    const { name, description, publicKey, secretKey } =
      (await request.json()) as {
        name: string;
        description: string;
        publicKey: string;
        secretKey: string;
      };

    // Create a new project in the database
    const newProject = await client.project.create({
      data: {
        name,
        description,
        publicKey,
        secretKey,
      },
    });

    return NextResponse.json(newProject);
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.error();
  }
}
