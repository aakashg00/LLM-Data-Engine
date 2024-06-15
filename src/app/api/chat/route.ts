import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { Langfuse } from "langfuse";
import getLangfuseClient from "~/app/langfuse";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
// IMPORTANT! Set the runtime to edge
// export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages, projectId, traceId, spanId } = (await req.json()) as {
      messages: ChatCompletionMessageParam[];
      projectId: string;
      traceId: string;
      spanId: string;
    };

    const langfuse = await getLangfuseClient(projectId);

    if (langfuse) {
      const generation = langfuse.generation({
        traceId,
        parentObservationId: spanId,
        name: "my-generation",
        model: "gpt-3.5-turbo",
        modelParameters: {
          temperature: 1.3,
          top_p: 1,
        },
        input: messages,
      });

      // Ask OpenAI for a streaming chat completion given the prompt
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        stream: true,
        messages,
        temperature: 1.3,
        top_p: 1,
      });

      // Convert the response into a friendly text-stream
      const stream = OpenAIStream(response, {
        onStart: () => {
          // Add completionStartTime timestamp to be able to break down latency
          // into delay until first token and the streaming duration
          generation.update({
            completionStartTime: new Date(),
          });
        },
        onCompletion: async (completion) => {
          generation.update({
            output: completion,
          });
          // Make sure all events are successifully send to Langfuse before the stream terminates.
          await langfuse.flushAsync();
          // If you run on Vercel, waitUntil will do this in a non-blocking way
          // npm i @vercel/functions
          // import { waitUntil } from "@vercel/functions";
          // waitUntil(langfuse.flushAsync())
        },
      });

      return new StreamingTextResponse(stream, {
        headers: {
          "gen-id": generation.id,
        },
      });
    }
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return Response.json({ name, status, headers, message }, { status });
    } else {
      console.error(error);
    }
  }
}
