import React from "react";
import { useState } from "react";

type Props = {
  submit: () => void;
  prompt: string;
};

function SystemPromptForm(props: Props) {
  const [submitted, setSubmitted] = useState<boolean>(false);

  async function submitPrompt(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    props.submit();
  }

  return (
    <div>
      <form onSubmit={submitPrompt}>
        <div
          className={
            (submitted ? "hidden " : "") +
            "mx-auto flex w-2/3 flex-col gap-1 rounded-md border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-slate-900 dark:shadow-slate-700/[.7] md:p-5"
          }
        >
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            Instructions.
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{props.prompt}</p>

          <button
            className="mt-2 inline-flex items-center justify-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            type="submit"
          >
            Begin
          </button>
        </div>
      </form>
      {submitted && (
        <div>
          <div className="mx-auto flex w-full flex-col gap-1 rounded-md border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-slate-900 dark:shadow-slate-700/[.7] md:p-5">
            <p className="my-0 text-sm font-semibold dark:text-gray-400">
              System Prompt
            </p>
            <p className="my-0 max-h-80 overflow-y-scroll text-gray-500 dark:text-gray-400">
              {props.prompt}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SystemPromptForm;
