"use client";

import React, { useEffect, useCallback } from "react";
import SystemPromptForm from "../../_components/Annotate/SystemPromptForm";
import { useState, useRef } from "react";
import SystemPrompt from "./SystemPromptForm";
import TwoOptions from "../../_components/Annotate/TwoOptions";
import TextEditorWrapper from "../../_components/Annotate/TextEditorWrapper";

import UserResponse from "../../_components/Annotate/UserResponse";
import SessionEnded from "../../_components/Annotate/SessionEnded";

import { useChat } from "ai/react";
import { Message as AIMessage } from "ai";
import { Conversation, Message, Project } from "@prisma/client";

import type { Langfuse } from "langfuse";

import toast from "react-hot-toast";

export type AnnotationType = "EDIT" | "TAG" | "BOTH";

interface Props {
  prompt: string;
  projectId: string;
  type: AnnotationType;
  idx: number;
  pageClicked: boolean[];
}

function AnnotatePage(props: Props) {
  const sessionId = useRef<string>(crypto.randomUUID() + props.idx);
  const latestTraceId = useRef<string | null>(null); // langfuse id of most recent trace
  const latestSpanId = useRef<string | null>(null); // langfuse id of most recent span

  const latestGen1Id = useRef<string | null>(null); // langfuse id of first generation (first option generated)
  const latestGen2Id = useRef<string | null>(null); // langfuse id of second generation (second option generated)

  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    setInput,
    handleSubmit,
    append,
    reload,
    data,
  } = useChat({
    id: sessionId.current + "1",
    onResponse(response) {
      // Extracting langfuse generation ID from the response
      const genid = response.headers.get("gen-id");
      latestGen1Id.current = genid;
    },
  });

  const {
    messages: messages2,
    input: input2,
    handleInputChange: handleInputChange2,
    setInput: setInput2,
    handleSubmit: handleSubmit2,
    setMessages: setMessages2,
    append: append2,
    reload: reload2,
  } = useChat({
    id: sessionId.current + "2",
    onResponse(response) {
      // Extracting langfuse generation ID from the response
      const genid = response.headers.get("gen-id");
      latestGen2Id.current = genid;
    },
  });

  const messagesRef = useRef<AIMessage[]>(messages);
  const messages2Ref = useRef<AIMessage[]>(messages2);

  const loading = useRef<boolean>(true);

  const replaceLastMessage1 = useCallback(
    (newMessage: AIMessage) => {
      const currentMessages = messagesRef.current;
      const updatedMessages = [...currentMessages.slice(0, -1), newMessage];

      setMessages(updatedMessages);
      messagesRef.current = updatedMessages;
    },
    [messagesRef, setMessages],
  );

  const replaceLastMessage2 = useCallback(
    (newMessage: AIMessage) => {
      const currentMessages = messages2Ref.current;
      const updatedMessages = [...currentMessages.slice(0, -1), newMessage];

      setMessages2(updatedMessages);
      messages2Ref.current = updatedMessages;
    },
    [messages2Ref, setMessages2],
  );

  const deleteLastMessage1 = useCallback(
    (spanId: string) => {
      const currentMessages = messagesRef.current;
      const updatedMessages = currentMessages.slice(0, -1);

      setMessages(updatedMessages);
      messagesRef.current = updatedMessages;
      void reload({
        options: {
          body: {
            projectId: props.projectId,
            traceId: latestTraceId.current,
            spanId,
          },
        },
      });
    },
    [messagesRef, setMessages, reload],
  );

  const deleteLastMessage2 = useCallback(
    (spanId: string) => {
      const currentMessages = messages2Ref.current;
      const updatedMessages = currentMessages.slice(0, -1);

      setMessages2(updatedMessages);
      messages2Ref.current = updatedMessages;
      void reload2({
        options: {
          body: {
            projectId: props.projectId,
            traceId: latestTraceId.current,
            spanId,
          },
        },
      });
    },
    [messages2Ref, setMessages2, reload2],
  );

  useEffect(() => {
    messagesRef.current = messages || [];
  }, [messages]);

  useEffect(() => {
    messages2Ref.current = messages2 || [];
  }, [messages2]);

  const convoIdRef = useRef<string | undefined>();
  const currentMessageIdRef = useRef<string>("");

  const [allComponents, setAllComponents] = useState<React.JSX.Element[]>([]);

  async function submitSystemPrompt() {
    try {
      await fetch(`/api/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: props.projectId,
        }),
      })
        .then((response) => response.json() as Promise<{ id: string }>)
        .then((responseData) => {
          console.log(responseData);
          convoIdRef.current = responseData.id;
        });
    } catch (error) {
      console.error("Error saving conversation:", error);
    }

    try {
      // create empty message to connect responses to
      console.log(convoIdRef.current);
      const response = await fetch(`/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: "",
          conversationId: convoIdRef.current,
          role: "assistant",
        }),
      });
      currentMessageIdRef.current = ((await response.json()) as Message).id;
    } catch (error) {
      console.error("Error saving message:", error);
    }

    const traceResponse = await fetch(`/api/langfuse/trace`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "my-trace",
        input: {
          role: "system",
          content: props.prompt,
        },
        sessionId: sessionId.current,
        projectId: props.projectId,
      }),
    });

    const traceData = (await traceResponse.json()) as { id: string };
    latestTraceId.current = traceData.id;

    const spanResponse = await fetch(`/api/langfuse/span`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "my-span",
        traceId: latestTraceId.current,
        projectId: props.projectId,
      }),
    });

    const spanData = (await spanResponse.json()) as { id: string };
    latestSpanId.current = spanData.id;

    setAllComponents((prevComponents) => [
      ...prevComponents,
      <TwoOptions
        selectOneText={(text: string | undefined) => choseResponseOne(text)}
        selectTwoText={(text: string | undefined) => choseResponseTwo(text)}
        key={`two-options-${allComponents.length}` + props.idx}
        messageId={currentMessageIdRef.current}
        replaceBothMessages={replaceBothMessages}
        tooManyRejections={tooManyRejections}
        sessionId={sessionId.current}
      />,
    ]);

    await Promise.all([
      append(
        {
          role: "system",
          content: props.prompt,
        },
        {
          options: {
            body: {
              projectId: props.projectId,
              traceId: latestTraceId.current,
              spanId: latestSpanId.current,
            },
          },
        },
      ),
      append2(
        {
          role: "system",
          content: props.prompt,
        },
        {
          options: {
            body: {
              projectId: props.projectId,
              traceId: latestTraceId.current,
              spanId: latestSpanId.current,
            },
          },
        },
      ),
    ]);
  }

  useEffect(() => {
    if (props.pageClicked[props.idx] && loading.current) {
      loading.current = false;
      void toast.promise(submitSystemPrompt(), {
        loading: "Loading...",
        success: "Success!",
        error: (err: Error) => <p>{err.message}</p>,
      });
    }
  }, [props.pageClicked, props.idx]);

  async function choseResponseOne(text: string | undefined) {
    await fetch("/api/langfuse/generation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: latestGen1Id.current,
        traceId: latestTraceId.current,
        statusMessage: "selected",
        metadata: { selected: "true" },
        projectId: props.projectId,
      }),
    });

    await fetch("/api/langfuse/generation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: latestGen2Id.current,
        traceId: latestTraceId.current,
        statusMessage: "not selected",
        metadata: { selected: "false" },
        projectId: props.projectId,
      }),
    });

    if (props.type !== "EDIT") {
      setAllComponents((prevComponents) => [
        ...prevComponents,
        <TextEditorWrapper
          text={text ?? ""}
          type={"TAG"}
          submit={(text: string | undefined, changed: boolean) =>
            submitEditResponse(text, changed)
          }
          key={`text-editor-${allComponents.length}` + props.idx}
        />,
      ]);
    } else {
      setAllComponents((prevComponents) => [
        ...prevComponents,
        <TextEditorWrapper
          text={text ?? ""}
          type={"EDIT"}
          submit={(text: string | undefined, changed: boolean) =>
            submitEditResponse(text, changed)
          }
          key={`text-editor-${allComponents.length}` + props.idx}
        />,
      ]);
    }
  }

  async function choseResponseTwo(text: string | undefined) {
    await fetch("/api/langfuse/generation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: latestGen2Id.current,
        traceId: latestTraceId.current,
        statusMessage: "selected",
        metadata: { selected: "true" },
        projectId: props.projectId,
      }),
    });

    await fetch("/api/langfuse/generation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: latestGen1Id.current,
        traceId: latestTraceId.current,
        statusMessage: "not selected",
        metadata: { selected: "false" },
        projectId: props.projectId,
      }),
    });

    if (props.type !== "EDIT") {
      setAllComponents((prevComponents) => [
        ...prevComponents,
        <TextEditorWrapper
          text={text ?? ""}
          type={"TAG"}
          submit={(text: string | undefined, changed: boolean) =>
            submitEditResponse(text, changed)
          }
          key={`text-editor-${allComponents.length}` + props.idx}
        />,
      ]);
    } else {
      setAllComponents((prevComponents) => [
        ...prevComponents,
        <TextEditorWrapper
          text={text ?? ""}
          type={"EDIT"}
          submit={(text: string | undefined, changed: boolean) =>
            submitEditResponse(text, changed)
          }
          key={`text-editor-${allComponents.length}` + props.idx}
        />,
      ]);
    }
  }

  async function replaceBothMessages(feedback: string) {
    await fetch("/api/langfuse/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        traceId: latestTraceId.current,
        parentObservationId: latestSpanId.current,
        name: "User marked both inadequate",
        metadata: { feedback },
        projectId: props.projectId,
      }),
    });

    await fetch("/api/langfuse/generation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: latestGen1Id.current,
        traceId: latestTraceId.current,
        statusMessage: "not selected",
        metadata: { selected: "false" },
        projectId: props.projectId,
      }),
    });

    await fetch("/api/langfuse/generation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: latestGen2Id.current,
        traceId: latestTraceId.current,
        statusMessage: "not selected",
        metadata: { selected: "false" },
        projectId: props.projectId,
      }),
    });
    const spanResponse = await fetch("/api/langfuse/span", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "my-span",
        traceId: latestTraceId.current,
        projectId: props.projectId,
      }),
    });

    const data = (await spanResponse.json()) as { id: string };
    latestSpanId.current = data.id;

    await Promise.all([
      deleteLastMessage1(latestSpanId.current),
      deleteLastMessage2(latestSpanId.current),
    ]);
  }

  async function tooManyRejections(feedback: string) {
    await fetch("/api/langfuse/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        traceId: latestTraceId.current,
        parentObservationId: latestSpanId.current,
        name: "User marked both inadequate",
        metadata: { feedback },
        projectId: props.projectId,
      }),
    });

    await fetch("/api/langfuse/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        traceId: latestTraceId.current,
        name: "5 rejections",
        projectId: props.projectId,
      }),
    });

    await fetch("/api/langfuse/trace", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: latestTraceId.current,
        metadata: { tooManyRejections: true },
        tags: ["rejected"],
        projectId: props.projectId,
      }),
    });
    try {
      await toast.promise(
        fetch(`/api/conversations/${convoIdRef.current}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fiveRegens: true }),
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update conversation");
          }
        }),
        {
          loading: "Ending session...", // Loading message
          success: "Session ended", // Success message
          error: "Failed to end session.", // Error message
        },
      );

      submitUserEnd();
    } catch (error) {
      console.error("Error updating conversation:", error);
      throw error;
    }
  }

  const submitTagResponse = async (tags: JSON) => {
    try {
      // edit empty message with new edited content
      const res = await fetch(`/api/messages/${currentMessageIdRef.current}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tags,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update message");
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }

    setAllComponents((prevComponents) => [
      ...prevComponents,
      <UserResponse
        submitCont={(text: string) => submitUserContinue(text)}
        submitEnd={submitUserEnd}
        key={`user-response-${allComponents.length}` + props.idx}
      />,
    ]);
  };

  const submitEditResponse = async (
    text: string | undefined,
    changed: boolean,
  ) => {
    try {
      // edit empty message with new edited content
      const res = await fetch(`/api/messages/${currentMessageIdRef.current}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: text,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update message");
      }

      const responseData = (await res.json()) as Message;

      const newMessage: AIMessage = {
        content: text ?? "",
        role: "assistant",
        id: responseData.id,
      };

      await fetch("/api/langfuse/trace", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: latestTraceId.current,
          output: { role: newMessage.role, content: newMessage.content },
          projectId: props.projectId,
        }),
      });

      if (changed) {
        await Promise.all([
          fetch("/api/langfuse/event", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              traceId: latestTraceId.current,
              parentObservationId: latestSpanId.current,
              name: "User edited AI response",
              input: { content: messages }, // change to original unedited message content
              projectId: props.projectId,
            }),
          }),
          fetch("/api/langfuse/trace", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: latestTraceId.current,
              tags: ["edited"],
              projectId: props.projectId,
            }),
          }),
        ]);
      }

      replaceLastMessage1(newMessage);
      replaceLastMessage2(newMessage);
    } catch (error) {
      console.error("Error saving message:", error);
    }

    setAllComponents((prevComponents) => [
      ...prevComponents,
      <UserResponse
        submitCont={(text: string) => submitUserContinue(text)}
        submitEnd={submitUserEnd}
        key={`user-response-${allComponents.length}` + props.idx}
      />,
    ]);
  };

  async function submitUserContinue(text: string) {
    try {
      const messageResponse = await fetch(`/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: text,
          conversationId: convoIdRef.current,
          role: "user",
        }),
      });

      if (messageResponse.ok) {
        console.log("Message sent successfully");
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }

    try {
      // create empty message to connect responses to
      const response = await fetch(`/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: "",
          conversationId: convoIdRef.current,
          role: "assistant",
        }),
      });
      currentMessageIdRef.current = ((await response.json()) as Message).id;
    } catch (error) {
      console.error("Error saving message:", error);
    }

    const simplifiedMessages = messagesRef.current.map(({ role, content }) => ({
      role,
      content,
    }));

    simplifiedMessages.push({ role: "user", content: text });

    const response = await fetch("/api/langfuse/trace", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "my-trace",
        input: simplifiedMessages,
        sessionId: sessionId.current,
        projectId: props.projectId,
      }),
    });

    if (!response.ok) {
      console.error("Failed to create trace:", await response.text());
    } else {
      const data = (await response.json()) as { id: string };
      latestTraceId.current = data.id;
    }

    const spanResponse = await fetch("/api/langfuse/span", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "my-span",
        traceId: latestTraceId.current,
        projectId: props.projectId,
      }),
    });

    if (!spanResponse.ok) {
      console.error("Failed to create span:", await spanResponse.text());
    } else {
      const data = (await spanResponse.json()) as { id: string };
      latestSpanId.current = data.id;
    }

    setAllComponents((prevComponents) => [
      ...prevComponents,
      <TwoOptions
        selectOneText={(text: string | undefined) => choseResponseOne(text)}
        selectTwoText={(text: string | undefined) => choseResponseTwo(text)}
        key={`two-options-${allComponents.length}` + props.idx}
        messageId={currentMessageIdRef.current}
        replaceBothMessages={replaceBothMessages}
        tooManyRejections={tooManyRejections}
        sessionId={sessionId.current}
      />,
    ]);
    await Promise.all([
      append(
        {
          role: "user",
          content: text,
        },
        {
          options: {
            body: {
              traceId: latestTraceId.current,
              spanId: latestSpanId.current,
              projectId: props.projectId,
            },
          },
        },
      ),
      append2(
        {
          role: "user",
          content: text,
        },
        {
          options: {
            body: {
              traceId: latestTraceId.current,
              spanId: latestSpanId.current,
              projectId: props.projectId,
            },
          },
        },
      ),
    ]);
  }

  function submitUserEnd() {
    setAllComponents((prevComponents) => [
      ...prevComponents,
      <SessionEnded
        key={`session-ended-${allComponents.length}` + props.idx}
      />,
    ]);
  }

  return (
    <>
      <div className="mx-auto flex flex-col gap-3">
        {allComponents.map((component: React.JSX.Element, key: number) => (
          <div key={key}>{component}</div>
        ))}
      </div>
    </>
  );
}

export default AnnotatePage;
