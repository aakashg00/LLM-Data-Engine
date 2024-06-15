import React from "react";
import Tiptap from "./Tiptap";
import TiptapTag from "./AnnotateEditor";
import type { AnnotationType } from "./AnnotatePage";

type Props = {
  text: string | undefined;
  submit: (
    text: string | undefined,
    ogText: string | undefined,
    changed: boolean,
  ) => void;
};

function TextEditorWrapper({ text, submit }: Props) {
  return (
    <div>
      <div className="mx-auto flex w-full flex-col gap-1 rounded-md border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-slate-900 dark:shadow-slate-700/[.7] md:p-5">
        <h2 className="m-0 p-0 text-lg font-bold text-gray-800 dark:text-white">
          Refine the response.
        </h2>
        <p className="m-0 p-0 text-gray-500 dark:text-gray-400">
          Edit the question to make it more appropriate for the prompt.
        </p>
        <div className="flex flex-col gap-5">
          <Tiptap text={text} submit={submit} />
        </div>
      </div>
    </div>
  );
}

export default TextEditorWrapper;
