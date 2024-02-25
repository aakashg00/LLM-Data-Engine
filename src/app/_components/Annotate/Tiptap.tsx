import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import Blockquote from "@tiptap/extension-blockquote";
import OrderedList from "@tiptap/extension-ordered-list";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight, all } from "lowlight";
import Code from "@tiptap/extension-code";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import React from "react";
import { Toolbar } from "./Toolbar";
import { useState } from "react";

import { mergeAttributes } from "@tiptap/react";

import Heading from "@tiptap/extension-heading";
import { htmlToMarkdown, markdownToHtml } from "./Parser";

type Levels = 1 | 2 | 3;

// const classes: Record<Levels, string> = {
//   1: "text-4xl",
//   2: "text-3xl",
//   3: "text-2xl",
// };

type Props = {
  text: string | undefined;
  submit: (text: string | undefined, changed: boolean) => void;
};

export default function Tiptap({ text, submit }: Props) {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const lowlight = createLowlight(all);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Heading.configure({ levels: [1, 2] }).extend({
        levels: [1, 2],
        renderHTML({ node, HTMLAttributes }) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          const level: number = this.options.levels.includes(node.attrs.level)
            ? node.attrs.level
            : // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              this.options.levels[0];
          const classes: {
            [key: number]: string;
            1: string;
            2: string;
            3: string;
            4: string;
            5: string;
            6: string;
          } = {
            1: "text-3xl font-bold",
            2: "text-2xl font-bold",
            3: "text-xl font-bold",
            4: "text-lg font-bold",
            5: "text-base font-bold",
            6: "text-sm font-bold",
          };
          return [
            `h${level}`,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
              class: `${classes[level]}`,
            }),
            0,
          ];
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc pl-6",
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: "relative border-s-4 ps-4",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal pl-6",
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "xml",
        HTMLAttributes: {
          class: "bg-gray-100 p-2 my-4 rounded-sm",
        },
      }),
      Code.configure({
        HTMLAttributes: {
          class: "bg-gray-100 p-1 rounded-sm",
        },
      }),
      Table,
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: markdownToHtml(text ?? ""),
    editorProps: {
      attributes: {
        class: "text-sm p-3 min-h-[150px] border-input",
      },
    },
  });

  function submitChange() {
    setSubmitted(true);
    editor?.setOptions({
      editorProps: {
        attributes: {
          class: "p-3 text-gray-500 text-sm",
        },
      },
      editable: false,
    });
    const markdownText = htmlToMarkdown(editor?.getHTML() ?? "").trim();
    const compareText = (text ?? "").trim();

    console.log("Converted Markdown:", markdownText);
    console.log("Text to Compare:", compareText);
    console.log("Lengths:", markdownText.length, compareText.length);

    // Compare the strings
    const changed = markdownText !== compareText;

    submit(markdownText, changed);
  }

  return (
    <div>
      <div className="mt-3 flex flex-col justify-stretch rounded-md border">
        {!submitted && <Toolbar editor={editor} />}
        <EditorContent editor={editor} />
      </div>
      <button
        onClick={() => submitChange()}
        className={
          submitted
            ? "hidden"
            : "float-right mt-2 inline-flex items-center justify-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
        }
      >
        Finish Editing
      </button>
    </div>
  );
}
