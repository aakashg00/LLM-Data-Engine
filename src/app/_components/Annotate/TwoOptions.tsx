import React, { useState, useEffect, useRef } from "react";
import cn from "classnames";

import { useChat } from "ai/react";
import TiptapViewer from "./TiptapViewer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { toast } from "react-hot-toast";
import { Card } from "~/components/ui/card";

type Props = {
  selectOneText: (text: string | undefined) => void;
  selectTwoText: (text: string | undefined) => void;
  messageId: string;
  replaceBothMessages: (feedback: string) => void;
  tooManyRejections: (feedback: string) => void;
  sessionId: string;
};

function TwoOptions(props: Props) {
  const [oneSelected, setOneSelected] = useState<boolean>(false);
  const [twoSelected, setTwoSelected] = useState<boolean>(false);

  const [bothBadSelected, setBothBadSelected] = useState<boolean>(false);

  const [sessionEnded, setSessionEnded] = useState<boolean>(false);

  const [messageIndex, setMessageIndex] = useState<number>(-1);
  const [message2Index, setMessage2Index] = useState<number>(-1);

  const [oneText, setOneText] = useState<string | undefined>("");
  const [twoText, setTwoText] = useState<string | undefined>("");

  const lastLFGenerationIdOne = useRef<string | null>(null);
  const lastLFGenerationIdTwo = useRef<string | null>(null);

  const { messages, isLoading, setMessages, reload } = useChat({
    id: props.sessionId + "1",
  });

  const {
    messages: messages2,
    input: input2,
    handleInputChange: handleInputChange2,
    setInput: setInput2,
    handleSubmit: handleSubmit2,
    setMessages: setMessages2,
    reload: reload2,
    append: append2,
    isLoading: isLoading2,
  } = useChat({
    id: props.sessionId + "2",
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");

  const [bothBadCount, setBothBadCount] = useState<number>(0);

  async function selectedOne() {
    setOneSelected(true);
    setMessageIndex(-2);
    setMessage2Index(-2);
    await addResponses(oneText ?? "", twoText ?? "", true, false);
    props.selectOneText(messages?.at(-1)?.content);
    console.log(lastLFGenerationIdOne.current);
  }

  async function selectedTwo() {
    setTwoSelected(true);
    setMessageIndex(-2);
    setMessage2Index(-2);
    await addResponses(oneText ?? "", twoText ?? "", false, true);
    props.selectTwoText(messages2?.at(-1)?.content);
    console.log(lastLFGenerationIdTwo.current);
  }

  async function addResponses(
    response1: string,
    response2: string,
    isSelected1: boolean,
    isSelected2: boolean,
  ) {
    try {
      const response = await fetch(
        `/api/messages/${props.messageId}/responses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            response1,
            response2,
            isSelected1,
            isSelected2,
            feedback,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create responses");
      }

      // const responseData = await response.json();
      // return responseData;
    } catch (error) {
      console.error("Error creating responses:", error);
      throw new Error("Error submitting feedback.");
    }
  }

  async function choseBothBad() {
    if (!isLoading && !isLoading2) {
      setBothBadSelected(true);
      setBothBadCount((prevCount) => prevCount + 1);
      setIsModalOpen(true);
    }
  }

  async function submitFeedback() {
    await addResponses(oneText ?? "", twoText ?? "", false, false);

    setIsModalOpen(false);
    if (bothBadCount >= 5) {
      setSessionEnded(true);
      props.tooManyRejections(feedback);
      return;
    }
    setOneText("");
    setTwoText("");
    setFeedback("");
    try {
      props.replaceBothMessages(feedback);
    } catch (error) {
      console.error("Error generating new responses", error);
      throw new Error("Error generating new responses.");
    }
  }

  useEffect(() => {
    if (messageIndex == -1) {
      setMessageIndex(messages.length);
    }
    if (messageIndex == messages.length - 1) {
      setOneText(messages?.at(messageIndex)?.content);
    }
  }, [messages]);

  useEffect(() => {
    if (message2Index == -1) {
      setMessage2Index(messages2.length);
    }
    if (message2Index == messages2.length - 1) {
      setTwoText(messages2?.at(message2Index)?.content);
    }
  }, [messages2]);

  useEffect(() => {
    if (isLoading || isLoading2) {
      setBothBadSelected(false);
    }
  }, [isLoading, isLoading2]);

  return (
    <Card className="mx-auto flex w-full flex-col gap-1 p-4 dark:border-gray-700 dark:bg-slate-900 dark:shadow-slate-700/[.7] md:p-5">
      <h2 className="m-0 p-0 text-lg font-bold text-gray-800 dark:text-white">
        Select the best response.
      </h2>
      <div>
        <p className="m-0 p-0 text-gray-500 dark:text-gray-400">
          When the options are fully loaded, select the best one.
        </p>
        <div className="mb-2 mt-4 grid grid-cols-2 gap-2">
          <div
            onClick={
              !(
                oneSelected ||
                twoSelected ||
                isLoading ||
                isLoading2 ||
                bothBadSelected ||
                sessionEnded
              )
                ? selectedOne
                : undefined
            }
            className={cn(
              "rounded-md",
              "border",
              "p-3",
              "dark:text-white",
              "dark:hover:border-white",
              {
                "border-2 border-blue-600": oneSelected,
                "hover:cursor-pointer hover:border-blue-600": !(
                  oneSelected ||
                  twoSelected ||
                  bothBadSelected ||
                  sessionEnded
                ),
              },
            )}
          >
            <h6 className="font-semibold">Option 1</h6>
            {/* <p>{oneText}</p> */}
            <TiptapViewer text={oneText} />
          </div>
          <div
            onClick={
              !(
                oneSelected ||
                twoSelected ||
                isLoading ||
                isLoading2 ||
                bothBadSelected ||
                sessionEnded
              )
                ? selectedTwo
                : undefined
            }
            className={cn(
              "rounded-md",
              "border",
              "p-3",
              "dark:text-white",
              "dark:hover:border-white",
              {
                "border-2 border-blue-600": twoSelected,
                "hover:cursor-pointer hover:border-blue-600": !(
                  oneSelected ||
                  twoSelected ||
                  bothBadSelected ||
                  sessionEnded
                ),
              },
            )}
          >
            <h6 className="font-semibold">Option 2</h6>
            {/* <p>{twoText}</p> */}
            <TiptapViewer text={twoText} />
          </div>
        </div>
        <p
          onClick={
            !(
              oneSelected ||
              twoSelected ||
              isLoading ||
              isLoading2 ||
              bothBadSelected ||
              sessionEnded
            )
              ? choseBothBad
              : undefined
          }
          className={
            "float-right text-sm text-blue-600 underline underline-offset-1" +
            (!(
              oneSelected ||
              twoSelected ||
              isLoading ||
              isLoading2 ||
              bothBadSelected ||
              sessionEnded
            )
              ? " cursor-pointer"
              : " opacity-80")
          }
        >
          Both options are inadequate.
        </p>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Why were both responses inadequate?</DialogTitle>
              <DialogDescription>
                Please provide a detailed and thoughtful explanation.
              </DialogDescription>
            </DialogHeader>

            <textarea
              name="description"
              id="description"
              className="h-28 min-h-28 w-full rounded-md border border-gray-300 bg-white p-2 text-sm"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <DialogFooter>
              {/* <Button type="submit">Save changes</Button> */}
              <Button
                // className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                onClick={() =>
                  toast.promise(submitFeedback(), {
                    loading: "Submitting feedback...",
                    success: "Success!",
                    error: (err: Error) => <p>{err.message}</p>,
                  })
                }
              >
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}

export default TwoOptions;
