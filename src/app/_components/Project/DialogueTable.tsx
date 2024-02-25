import React, { useState, useEffect } from "react";
import ConversationSidebar from "../Dashboard/ConversationSidebar";
import type { Conversation, Message, Project } from "@prisma/client";

export type ConversationWithMessages = Conversation & {
  messages: Message[];
};

interface Props {
  project: Project;
}

function DialogueTable(props: Props) {
  const [conversations, setConversations] = useState<
    ConversationWithMessages[]
  >([]); // State to store conversation data
  const [showSidebar, setShowSidebar] = useState<boolean>(false); // State to manage sidebar visibility

  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setShowSidebar(false);
    // Fetch conversation data from API endpoint
    fetch(`/api/conversations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId: props.project.id }),
    })
      .then((response) => response.json())
      .then((res: { conversations: ConversationWithMessages[] }) =>
        setConversations(res.conversations),
      )
      .catch((error) => console.error("Error fetching conversations:", error));
  }, [props.project]);

  const handleRowClick = (id: string) => {
    setShowSidebar(true); // Set showSidebar state to true when row is clicked
    setSelectedId(id);
  };

  const formatDateTime = (date: Date): string => {
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <div>
      {/* Page Header  */}
      <div className="flex items-center justify-between gap-x-5">
        <h2 className="inline-block text-lg font-semibold text-gray-800 dark:text-neutral-200">
          Dialogues
        </h2>
      </div>
      {/* End Page Header  */}

      {/* Users Table Card  */}
      <div className="flex flex-col space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
        {/* Filter Group  */}
        <div className="grid gap-y-2 md:grid-cols-2 md:gap-x-5 md:gap-y-0">
          <div>
            {/* Search Input  */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-3.5">
                <svg
                  className="h-4 w-4 flex-shrink-0 text-gray-500 dark:text-neutral-400"
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
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full rounded-lg border-transparent bg-gray-100 px-3 py-[7px] ps-10 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-transparent dark:bg-neutral-700 dark:text-neutral-400 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-600"
                placeholder="Search"
              />
            </div>
            {/* End Search Input  */}
          </div>
          {/* End Col  */}
        </div>
        {/* End Filter Group  */}

        <div>
          {/* Tab Content  */}
          <div
            id="hs-pro-tabs-dut-all"
            role="tabpanel"
            aria-labelledby="hs-pro-tabs-dut-item-all"
          >
            {/* Table Section  */}
            <div className="">
              <div className="inline-block w-full align-middle">
                {/* Table  */}
                <table className="w-full divide-y divide-gray-200 dark:divide-neutral-700">
                  <thead>
                    <tr className="divide-x divide-gray-200 border-t border-gray-200 dark:divide-neutral-700 dark:border-neutral-700">
                      <th scope="col">
                        {/* Sort Dropdown  */}
                        <div className="hs-dropdown relative inline-flex w-full cursor-pointer">
                          <button
                            id="hs-pro-dutnms"
                            type="button"
                            className="flex w-full items-center gap-x-1 px-5 py-2.5 text-start text-sm font-normal text-gray-500 focus:bg-gray-100 focus:outline-none dark:text-neutral-500 dark:focus:bg-neutral-700"
                          >
                            Time
                            <svg
                              className="h-3.5 w-3.5 flex-shrink-0"
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
                              <path d="m7 15 5 5 5-5" />
                              <path d="m7 9 5-5 5 5" />
                            </svg>
                          </button>

                          {/* Dropdown  */}
                          <div
                            className="hs-dropdown-menu hs-dropdown-open:opacity-100 duration z-10 hidden w-40 rounded-xl bg-white opacity-0 shadow-[0_10px_40px_10px_rgba(0,0,0,0.08)] transition-[opacity,margin] dark:bg-neutral-900 dark:shadow-[0_10px_40px_10px_rgba(0,0,0,0.2)]"
                            aria-labelledby="hs-pro-dutnms"
                          >
                            <div className="p-1">
                              <button
                                type="button"
                                className="flex w-full items-center gap-x-3 rounded-lg px-2 py-1.5 text-[13px] font-normal text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                              >
                                <svg
                                  className="h-3.5 w-3.5 flex-shrink-0"
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
                                  <path d="m5 12 7-7 7 7" />
                                  <path d="M12 19V5" />
                                </svg>
                                Sort ascending
                              </button>
                              <button
                                type="button"
                                className="flex w-full items-center gap-x-3 rounded-lg px-2 py-1.5 text-[13px] font-normal text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                              >
                                <svg
                                  className="h-3.5 w-3.5 flex-shrink-0"
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
                                  <path d="M12 5v14" />
                                  <path d="m19 12-7 7-7-7" />
                                </svg>
                                Sort descending
                              </button>
                              <button
                                type="button"
                                className="flex w-full items-center gap-x-3 rounded-lg px-2 py-1.5 text-[13px] font-normal text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                              >
                                <svg
                                  className="h-3.5 w-3.5 flex-shrink-0"
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
                                  <path d="m12 19-7-7 7-7" />
                                  <path d="M19 12H5" />
                                </svg>
                                Move left
                              </button>
                              <button
                                type="button"
                                className="flex w-full items-center gap-x-3 rounded-lg px-2 py-1.5 text-[13px] font-normal text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                              >
                                <svg
                                  className="h-3.5 w-3.5 flex-shrink-0"
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
                                  <path d="M5 12h14" />
                                  <path d="m12 5 7 7-7 7" />
                                </svg>
                                Move right
                              </button>

                              <div className="my-1 border-t border-gray-200 dark:border-neutral-800"></div>

                              <button
                                type="button"
                                className="flex w-full items-center gap-x-3 rounded-lg px-2 py-1.5 text-[13px] font-normal text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                              >
                                <svg
                                  className="h-3.5 w-3.5 flex-shrink-0"
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
                                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                  <line x1="2" x2="22" y1="2" y2="22" />
                                </svg>
                                Hide in view
                              </button>
                            </div>
                          </div>
                          {/* End Dropdown  */}
                        </div>
                        {/* End Sort Dropdown  */}
                      </th>

                      <th scope="col" className="min-w-[100px]">
                        {/* Sort Dropdown  */}
                        <div className="hs-dropdown relative inline-flex w-full cursor-pointer">
                          <button
                            id="hs-pro-dutsus"
                            type="button"
                            className="flex w-full items-center gap-x-1 px-5 py-2.5 text-start text-sm font-normal text-gray-500 focus:bg-gray-100 focus:outline-none dark:text-neutral-500 dark:focus:bg-neutral-700"
                          >
                            Title
                            <svg
                              className="h-3.5 w-3.5 flex-shrink-0"
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
                              <path d="m7 15 5 5 5-5" />
                              <path d="m7 9 5-5 5 5" />
                            </svg>
                          </button>

                          {/* Dropdown  */}
                          <div
                            className="hs-dropdown-menu hs-dropdown-open:opacity-100 duration z-10 hidden w-40 rounded-xl bg-white opacity-0 shadow-[0_10px_40px_10px_rgba(0,0,0,0.08)] transition-[opacity,margin] dark:bg-neutral-900 dark:shadow-[0_10px_40px_10px_rgba(0,0,0,0.2)]"
                            aria-labelledby="hs-pro-dutsus"
                          >
                            <div className="p-1">
                              <button
                                type="button"
                                className="flex w-full items-center gap-x-3 rounded-lg px-2 py-1.5 text-[13px] font-normal text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                              >
                                <svg
                                  className="h-3.5 w-3.5 flex-shrink-0"
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
                                  <path d="m5 12 7-7 7 7" />
                                  <path d="M12 19V5" />
                                </svg>
                                Sort ascending
                              </button>
                              <button
                                type="button"
                                className="flex w-full items-center gap-x-3 rounded-lg px-2 py-1.5 text-[13px] font-normal text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                              >
                                <svg
                                  className="h-3.5 w-3.5 flex-shrink-0"
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
                                  <path d="M12 5v14" />
                                  <path d="m19 12-7 7-7-7" />
                                </svg>
                                Sort descending
                              </button>
                              <button
                                type="button"
                                className="flex w-full items-center gap-x-3 rounded-lg px-2 py-1.5 text-[13px] font-normal text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                              >
                                <svg
                                  className="h-3.5 w-3.5 flex-shrink-0"
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
                                  <path d="m12 19-7-7 7-7" />
                                  <path d="M19 12H5" />
                                </svg>
                                Move left
                              </button>
                              <button
                                type="button"
                                className="flex w-full items-center gap-x-3 rounded-lg px-2 py-1.5 text-[13px] font-normal text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                              >
                                <svg
                                  className="h-3.5 w-3.5 flex-shrink-0"
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
                                  <path d="M5 12h14" />
                                  <path d="m12 5 7 7-7 7" />
                                </svg>
                                Move right
                              </button>

                              <div className="my-1 border-t border-gray-200 dark:border-neutral-800"></div>

                              <button
                                type="button"
                                className="flex w-full items-center gap-x-3 rounded-lg px-2 py-1.5 text-[13px] font-normal text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                              >
                                <svg
                                  className="h-3.5 w-3.5 flex-shrink-0"
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
                                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                  <line x1="2" x2="22" y1="2" y2="22" />
                                </svg>
                                Hide in view
                              </button>
                            </div>
                          </div>
                          {/* End Dropdown  */}
                        </div>
                        {/* End Sort Dropdown  */}
                      </th>

                      <th scope="col" className="min-w-[100px]">
                        {/* Sort Dropdown  */}
                        <div className="hs-dropdown relative inline-flex w-full cursor-pointer">
                          <button
                            id="hs-pro-dutsus"
                            type="button"
                            className="flex w-full items-center gap-x-1 px-5 py-2.5 text-start text-sm font-normal text-gray-500 focus:bg-gray-100 focus:outline-none dark:text-neutral-500 dark:focus:bg-neutral-700"
                          >
                            ID
                            <svg
                              className="h-3.5 w-3.5 flex-shrink-0"
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
                              <path d="m7 15 5 5 5-5" />
                              <path d="m7 9 5-5 5 5" />
                            </svg>
                          </button>

                          {/* Dropdown  */}
                          <div
                            className="hs-dropdown-menu hs-dropdown-open:opacity-100 duration z-10 hidden w-40 rounded-xl bg-white opacity-0 shadow-[0_10px_40px_10px_rgba(0,0,0,0.08)] transition-[opacity,margin] dark:bg-neutral-900 dark:shadow-[0_10px_40px_10px_rgba(0,0,0,0.2)]"
                            aria-labelledby="hs-pro-dutsus"
                          >
                            <div className="p-1">
                              <button
                                type="button"
                                className="flex w-full items-center gap-x-3 rounded-lg px-2 py-1.5 text-[13px] font-normal text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                              >
                                <svg
                                  className="h-3.5 w-3.5 flex-shrink-0"
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
                                  <path d="m5 12 7-7 7 7" />
                                  <path d="M12 19V5" />
                                </svg>
                                Sort ascending
                              </button>
                              <button
                                type="button"
                                className="flex w-full items-center gap-x-3 rounded-lg px-2 py-1.5 text-[13px] font-normal text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                              >
                                <svg
                                  className="h-3.5 w-3.5 flex-shrink-0"
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
                                  <path d="M12 5v14" />
                                  <path d="m19 12-7 7-7-7" />
                                </svg>
                                Sort descending
                              </button>
                              <button
                                type="button"
                                className="flex w-full items-center gap-x-3 rounded-lg px-2 py-1.5 text-[13px] font-normal text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                              >
                                <svg
                                  className="h-3.5 w-3.5 flex-shrink-0"
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
                                  <path d="m12 19-7-7 7-7" />
                                  <path d="M19 12H5" />
                                </svg>
                                Move left
                              </button>
                              <button
                                type="button"
                                className="flex w-full items-center gap-x-3 rounded-lg px-2 py-1.5 text-[13px] font-normal text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                              >
                                <svg
                                  className="h-3.5 w-3.5 flex-shrink-0"
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
                                  <path d="M5 12h14" />
                                  <path d="m12 5 7 7-7 7" />
                                </svg>
                                Move right
                              </button>

                              <div className="my-1 border-t border-gray-200 dark:border-neutral-800"></div>

                              <button
                                type="button"
                                className="flex w-full items-center gap-x-3 rounded-lg px-2 py-1.5 text-[13px] font-normal text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                              >
                                <svg
                                  className="h-3.5 w-3.5 flex-shrink-0"
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
                                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                  <line x1="2" x2="22" y1="2" y2="22" />
                                </svg>
                                Hide in view
                              </button>
                            </div>
                          </div>
                          {/* End Dropdown  */}
                        </div>
                        {/* End Sort Dropdown  */}
                      </th>

                      <th scope="col">
                        {/* Sort Dropdown  */}
                        <div className="hs-dropdown relative inline-flex w-full cursor-pointer">
                          <button
                            id="hs-pro-dutsus"
                            type="button"
                            className="flex w-full items-center gap-x-1 px-5 py-2.5 text-start text-sm font-normal text-gray-500 focus:bg-gray-100 focus:outline-none dark:text-neutral-500 dark:focus:bg-neutral-700"
                          >
                            Message Count
                            <svg
                              className="h-3.5 w-3.5 flex-shrink-0"
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
                              <path d="m7 15 5 5 5-5" />
                              <path d="m7 9 5-5 5 5" />
                            </svg>
                          </button>

                          {/* Dropdown  */}
                          <div
                            className="hs-dropdown-menu hs-dropdown-open:opacity-100 duration z-10 hidden w-40 rounded-xl bg-white opacity-0 shadow-[0_10px_40px_10px_rgba(0,0,0,0.08)] transition-[opacity,margin] dark:bg-neutral-900 dark:shadow-[0_10px_40px_10px_rgba(0,0,0,0.2)]"
                            aria-labelledby="hs-pro-dutsus"
                          >
                            <div className="p-1">
                              <button
                                type="button"
                                className="flex w-full items-center gap-x-3 rounded-lg px-2 py-1.5 text-[13px] font-normal text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                              >
                                <svg
                                  className="h-3.5 w-3.5 flex-shrink-0"
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
                                  <path d="m5 12 7-7 7 7" />
                                  <path d="M12 19V5" />
                                </svg>
                                Sort ascending
                              </button>
                              <button
                                type="button"
                                className="flex w-full items-center gap-x-3 rounded-lg px-2 py-1.5 text-[13px] font-normal text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                              >
                                <svg
                                  className="h-3.5 w-3.5 flex-shrink-0"
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
                                  <path d="M12 5v14" />
                                  <path d="m19 12-7 7-7-7" />
                                </svg>
                                Sort descending
                              </button>
                              <button
                                type="button"
                                className="flex w-full items-center gap-x-3 rounded-lg px-2 py-1.5 text-[13px] font-normal text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                              >
                                <svg
                                  className="h-3.5 w-3.5 flex-shrink-0"
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
                                  <path d="m12 19-7-7 7-7" />
                                  <path d="M19 12H5" />
                                </svg>
                                Move left
                              </button>
                              <button
                                type="button"
                                className="flex w-full items-center gap-x-3 rounded-lg px-2 py-1.5 text-[13px] font-normal text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                              >
                                <svg
                                  className="h-3.5 w-3.5 flex-shrink-0"
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
                                  <path d="M5 12h14" />
                                  <path d="m12 5 7 7-7 7" />
                                </svg>
                                Move right
                              </button>

                              <div className="my-1 border-t border-gray-200 dark:border-neutral-800"></div>

                              <button
                                type="button"
                                className="flex w-full items-center gap-x-3 rounded-lg px-2 py-1.5 text-[13px] font-normal text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                              >
                                <svg
                                  className="h-3.5 w-3.5 flex-shrink-0"
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
                                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                  <line x1="2" x2="22" y1="2" y2="22" />
                                </svg>
                                Hide in view
                              </button>
                            </div>
                          </div>
                          {/* End Dropdown  */}
                        </div>
                        {/* End Sort Dropdown  */}
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                    {conversations.map((conversation) => (
                      <tr
                        key={conversation.id}
                        className="cursor-pointer divide-x divide-gray-200 bg-white hover:bg-gray-50 dark:divide-neutral-700"
                        onClick={() => handleRowClick(conversation.id)}
                      >
                        {/* Render conversation data in each <td> */}
                        <td className="group relative h-px w-px whitespace-nowrap px-5 py-1">
                          <div className="flex w-full items-center gap-x-3">
                            <div className="grow">
                              <span className="text-sm text-gray-600 dark:text-neutral-400">
                                {formatDateTime(
                                  new Date(conversation.createdAt),
                                )}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="h-px w-px whitespace-nowrap px-5 py-1">
                          <span className="text-sm text-gray-600 dark:text-neutral-400">
                            New conversation
                          </span>
                        </td>
                        <td className="h-px w-px whitespace-nowrap px-5 py-1">
                          <span className="text-sm text-gray-600 dark:text-neutral-400">
                            {conversation.id}
                          </span>
                        </td>
                        <td className="h-px w-px whitespace-nowrap px-5 py-1">
                          <span className="text-sm text-gray-600 dark:text-neutral-400">
                            {conversation.messages.length}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* End Table  */}
                <div className="flex-none">
                  {/* Conversation sidebar */}
                  {showSidebar && (
                    <ConversationSidebar
                      close={() => setShowSidebar(false)}
                      id={selectedId}
                    />
                  )}
                </div>
              </div>
            </div>
            {/* End Table Section  */}

            {/* Footer  */}
            <div className="mt-5 grid grid-cols-2 items-center gap-y-2 sm:gap-x-5 sm:gap-y-0">
              <p className="text-sm text-gray-800 dark:text-neutral-200">
                <span className="font-medium">{conversations.length} </span>
                <span className="text-gray-500 dark:text-neutral-500">
                  result{conversations.length > 1 ? "s" : ""}
                </span>
              </p>

              {/* Pagination  */}
              <nav className="flex items-center justify-end gap-x-1">
                <button
                  type="button"
                  className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center gap-x-2 rounded-lg px-2.5 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-white/10 dark:focus:bg-neutral-700"
                >
                  <svg
                    className="h-3.5 w-3.5 flex-shrink-0"
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
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  <span aria-hidden="true" className="sr-only">
                    Previous
                  </span>
                </button>
                <div className="flex items-center gap-x-1">
                  <span className="flex min-h-[38px] min-w-[38px] items-center justify-center rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-800 disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-700 dark:text-white">
                    1
                  </span>
                  <span className="flex min-h-[38px] items-center justify-center px-1.5 py-2 text-sm text-gray-500 dark:text-neutral-500">
                    of
                  </span>
                  <span className="flex min-h-[38px] items-center justify-center px-1.5 py-2 text-sm text-gray-500 dark:text-neutral-500">
                    3
                  </span>
                </div>
                <button
                  type="button"
                  className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center gap-x-2 rounded-lg px-2.5 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-white/10 dark:focus:bg-neutral-700"
                >
                  <span aria-hidden="true" className="sr-only">
                    Next
                  </span>
                  <svg
                    className="h-3.5 w-3.5 flex-shrink-0"
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
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </nav>
              {/* End Pagination  */}
            </div>
            {/* End Footer  */}
          </div>
          {/* End Tab Content  */}
        </div>
      </div>
      {/* End Users Table Card  */}
    </div>
  );
}

export default DialogueTable;
