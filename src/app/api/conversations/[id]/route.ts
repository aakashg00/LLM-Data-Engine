import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  try {
    const conversation = await client.conversation.findUnique({
      where: {
        id,
      },
      include: {
        messages: true,
      },
    });

    if (!conversation) {
      return new NextResponse("Conversation with ID does not exist", {
        status: 404,
      });
    } else {
      return NextResponse.json({ conversation });
    }
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return NextResponse.error();
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = params.id;

  try {
    // Extract the value of fiveRegens from the request body
    const { fiveRegens } = (await req.json()) as { fiveRegens: boolean };

    // Update the conversation in the database
    const updatedConversation = await client.conversation.update({
      where: { id },
      data: { fiveRegens },
    });
    // Return the updated conversation
    return NextResponse.json({ conversation: updatedConversation });
  } catch (error) {
    console.error("Error updating conversation:", error);
    return NextResponse.error();
  }
}
