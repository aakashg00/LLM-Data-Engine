import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const messageId = params.id;

  try {
    // Extract response1 and response2 from the request body
    const { response1, response2, isSelected1, isSelected2, feedback } =
      (await req.json()) as {
        response1: string;
        response2: string;
        isSelected1: boolean;
        isSelected2: boolean;
        feedback: string;
      };

    // Create two new responses for the message in the database
    const createdResponses = await Promise.all([
      client.aI_Response.create({
        data: {
          content: response1,
          isSelected: isSelected1,
          feedback,
          message: { connect: { id: messageId } },
        },
      }),
      client.aI_Response.create({
        data: {
          content: response2,
          isSelected: isSelected2,
          feedback,
          message: { connect: { id: messageId } },
        },
      }),
    ]);

    // Return the created responses
    return NextResponse.json(createdResponses);
  } catch (error) {
    console.error("Error creating responses:", error);
    return NextResponse.error();
  }
}
