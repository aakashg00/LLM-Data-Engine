import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export async function POST(request: Request) {
  try {
    const {
      content,
      conversationId,
      role,
      response1,
      response2,
      response1Selected,
      response2Selected,
    } = (await request.json()) as {
      content: string;
      conversationId: string;
      role: string;
      response1: string;
      response2: string;
      response1Selected: boolean;
      response2Selected: boolean;
    };

    // check if response fields are provided
    if (
      response1 &&
      response2 &&
      response1Selected !== undefined &&
      response2Selected !== undefined
    ) {
      // make a new message with responses in the database
      const newMessage = await client.message.create({
        data: {
          content,
          role,
          conversation: { connect: { id: conversationId } },
          responses: {
            createMany: {
              data: [
                { content: response1, isSelected: response1Selected },
                { content: response2, isSelected: response2Selected },
              ],
            },
          },
        },
      });

      return NextResponse.json({ id: newMessage.id });
    } else {
      // Create a new message without responses in the database
      const newMessage = await client.message.create({
        data: {
          content,
          role,
          conversation: { connect: { id: conversationId } },
        },
      });

      return NextResponse.json({ id: newMessage.id });
    }
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.error();
  }
}

export async function GET() {
  try {
    // Fetch all messages from the database
    const messages = await client.message.findMany();

    // Return the fetched messages
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    // Return an error response if something went wrong
    return NextResponse.error();
  }
}
