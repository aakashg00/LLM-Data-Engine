import React, { useEffect, useState } from "react";
import type { ConversationWithMessages } from "../Project/DialogueTable";
import TiptapViewer from "../Annotate/TiptapViewer";

interface Props {
  close: () => void;
  id: string | null;
}

function ConversationSidebar(props: Props) {
  const [conversation, setConversation] =
    useState<ConversationWithMessages | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`api/conversations/${props.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = (await response.json()) as {
          conversation: ConversationWithMessages;
        };
        console.log("data here", data);
        setConversation(data.conversation);
      } catch (error) {
        console.error(error);
      }
    };

    if (props.id !== null) {
      console.log("id not null", props.id);
      void fetchData();
    }
  }, [props.id]);
  return (
    <div>
      <div className="hs-overlay hs-overlay-open:translate-x-0 dark:hs-overlay-backdrop-open:bg-neutral-900/90 fixed end-0 top-0 z-[80] h-full w-full transform border-s bg-white transition-all duration-300 dark:border-neutral-700 dark:bg-neutral-800 sm:w-[600px]">
        {/* Header  */}
        <div className="absolute end-4 top-3 z-10">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-600 dark:focus:bg-neutral-600"
            data-hs-overlay="#hs-pro-dutoo"
            onClick={props.close}
          >
            <span className="sr-only">Close offcanvas</span>
            <svg
              className="h-4 w-4 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        {/* End Header  */}

        {/* Content  */}
        <div className="flex h-full flex-col overflow-hidden overflow-y-auto [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar]:w-2">
          {/* Body  */}
          <div className="flex h-full flex-col p-5">
            <p className="text-xs font-semibold text-gray-500 dark:text-white">
              Conversation ID
            </p>
            <p className="text-sm text-gray-800 dark:text-white">
              {conversation?.id}
            </p>
          </div>

          {/* Chat UI */}
          <div className="mb-20 p-4">
            {/*  Chat Bubble  */}
            <ul className="space-y-5">
              {conversation?.messages.map((message, index) =>
                message.role === "assistant" ? (
                  <div key={index}>
                    {/*  Chat  */}

                    <li className="me-11 flex max-w-lg gap-x-2 sm:gap-x-4">
                      {/* <img
                className="inline-block size-9 rounded-full"
                src="/logo.png"
                alt="Image Description"
              /> */}

                      <span className="inline-flex size-[38px] flex-shrink-0 items-center justify-center rounded-full bg-orange-300">
                        <span className="text-md font-medium leading-none">
                          🤖
                        </span>
                      </span>

                      {/*  Card  */}
                      <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-slate-900">
                        <div className="space-y-1.5">
                          {/* <p className="text-sm text-gray-800 dark:text-white">
                            {message.content}
                          </p> */}
                          <TiptapViewer text={message.content} />
                        </div>
                      </div>
                      {/*  End Card  */}
                    </li>
                    {/*  End Chat  */}
                  </div>
                ) : (
                  <div key={index}>
                    {/*  Chat  */}
                    <li className="ms-auto flex gap-x-2 sm:gap-x-4">
                      <div className="grow space-y-3 text-end">
                        {/*  Card  */}
                        <div className="inline-block rounded-2xl bg-blue-600 p-4 shadow-sm">
                          <p className="text-sm text-white">
                            {message.content}
                          </p>
                        </div>
                        {/*  End Card  */}
                      </div>

                      <span className="inline-flex size-[38px] flex-shrink-0 items-center justify-center rounded-full bg-blue-200">
                        <span className="text-md font-medium leading-none text-white">
                          👤
                        </span>
                      </span>
                    </li>
                    {/*  End Chat  */}
                  </div>
                ),
              )}
            </ul>
            {/*  End Chat Bubble  */}
          </div>
          {/* End Chat UI */}

          {/* End Body  */}
        </div>
        {/* End Content  */}
      </div>
    </div>
  );
}

export default ConversationSidebar;
