import React from "react";
import { useState } from "react";

type Props = {
  submitCont: (text: string) => void;
  submitEnd: () => void;
};

function UserResponse(props: Props) {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [textAreaValue, setTextAreaValue] = useState<string>("");

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setTextAreaValue(e.target.value);
  }

  function submitPrompt() {
    setSubmitted(true);
    props.submitCont(textAreaValue);
  }

  function endSession() {
    setSubmitted(true);
    props.submitEnd();
  }

  return (
    <div>
      <div className="mx-auto flex w-full flex-col gap-1 rounded-md border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-slate-900 dark:shadow-slate-700/[.7] md:p-5">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          Write a response or end the session.
        </h2>
        <p className="m-0 p-0 text-gray-500 dark:text-gray-400">
          Enter a user response to continue the chat thread, or end the session.
        </p>
        <textarea
          className="my-3 block min-h-40 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-white dark:focus:ring-gray-600"
          placeholder="Start typing..."
          value={textAreaValue}
          onChange={handleChange}
          disabled={submitted}
        ></textarea>
        <div
          className={submitted ? "hidden" : "flex flex-row justify-end gap-3"}
        >
          <button
            className="mt-2 inline-flex items-center justify-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            onClick={submitPrompt}
          >
            Submit Message
          </button>
          <button
            className="mt-2 inline-flex items-center justify-center gap-x-2 rounded-lg border border-transparent bg-red-100 px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-200 disabled:pointer-events-none disabled:opacity-50 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            onClick={endSession}
          >
            End Session
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserResponse;
