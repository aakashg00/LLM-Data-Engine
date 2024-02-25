import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { content, messageId, isSelected, feedback } =
      (await request.json()) as {
        content: string;
        messageId: string;
        isSelected: boolean;
        feedback?: string;
      };

    if (feedback) {
      const newResponse = await client.response.create({
        data: {
          content,
          message: { connect: { id: messageId } },
          isSelected,
          feedback,
        },
      });
      return NextResponse.json({ newResponse });
    } else {
      const newResponse = await client.response.create({
        data: {
          content,
          message: { connect: { id: messageId } },
          isSelected,
        },
      });
      return NextResponse.json({ newResponse });
    }
  } catch (error) {
    console.error("Error creating response:", error);
    return NextResponse.error();
  }
}

export async function GET(request: Request) {
  try {
    // Fetch all responses from the database
    const responses = await client.response.findMany();

    // Return the fetched responses
    return NextResponse.json({ responses });
  } catch (error) {
    console.error("Error fetching responses:", error);
    return NextResponse.error();
  }
}
