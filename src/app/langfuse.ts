// utils/langfuse.ts
import { Langfuse } from "langfuse";
import { PrismaClient } from "@prisma/client";
import { fieldEncryptionExtension } from "prisma-field-encryption";

const globalClient = new PrismaClient();

export const client = globalClient.$extends(
  fieldEncryptionExtension({
    encryptionKey: process.env.PRISMA_FIELD_ENCRYPTION_KEY,
  }),
);

async function getLangfuseClient(projectId: string): Promise<Langfuse | null> {
  const project = await client.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    console.error("Project with ID does not exist");
  } else {
    return new Langfuse({
      publicKey: project.publicKey,
      secretKey: project.secretKey,
      baseUrl: "https://us.cloud.langfuse.com",
    });
  }
  return null;
}

export default getLangfuseClient;
