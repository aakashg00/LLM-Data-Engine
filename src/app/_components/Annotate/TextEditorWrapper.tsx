import React from "react";
import Tiptap from "./Tiptap";
import TiptapTag from "./TiptapTag";
import type { AnnotationType } from "./AnnotatePage";

type Props = {
  text: string | undefined;
  submit: (text: string | undefined, changed: boolean) => void;
  type: AnnotationType;
};

const headingMap = {
  TAG: "Annotate the response.",
  EDIT: "Refine the response.",
  BOTH: "Rate the response.",
};

const descrMap = {
  TAG: "Highlight the text and add relevant tags.",
  EDIT: "Edit the question to make it more appropriate for the prompt.",
  BOTH: "Use the sliders to rate the quality of the response.",
};

function TextEditorWrapper({ text, submit, type }: Props) {
  return (
    <div>
      <div className="mx-auto flex w-full flex-col gap-1 rounded-md border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-slate-900 dark:shadow-slate-700/[.7] md:p-5">
        <h2 className="m-0 p-0 text-lg font-bold text-gray-800 dark:text-white">
          {headingMap[type]}
        </h2>
        <p className="m-0 p-0 text-gray-500 dark:text-gray-400">
          {descrMap[type]}
        </p>
        <div className="flex flex-col gap-5">
          {type === "EDIT" ? (
            <Tiptap text={text} submit={submit} />
          ) : (
            <TiptapTag text={text} submit={submit} />
          )}
        </div>
      </div>
    </div>
  );
}

export default TextEditorWrapper;
