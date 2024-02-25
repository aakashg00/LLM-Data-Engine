import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const messageId = params.id;

  try {
    // Extract content from the request body
    const { content } = (await req.json()) as { content: string };

    // Update the message in the database
    const updatedMessage = await client.message.update({
      where: { id: messageId },
      data: { content },
    });

    // Return the updated message
    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.error();
  }
}
