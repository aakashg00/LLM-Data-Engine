import { useEditor, EditorContent, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import Blockquote from "@tiptap/extension-blockquote";
import OrderedList from "@tiptap/extension-ordered-list";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import Code from "@tiptap/extension-code";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";

import React, { useEffect } from "react";
import { Toolbar } from "./Toolbar";
import { useState } from "react";

import Heading from "@tiptap/extension-heading";
import { markdownToHtml } from "./Parser";

import { mergeAttributes } from "@tiptap/react";

type Levels = 1 | 2 | 3;

const classes: Record<Levels, string> = {
  1: "text-4xl",
  2: "text-3xl",
  3: "text-2xl",
};

type Props = {
  text: string | undefined;
};

export default function TiptapViewer({ text }: Props) {
  const lowlight = createLowlight(common);

  const editor = useEditor({
    editable: false,
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
        class: "text-sm",
      },
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }
    editor.commands.setContent(markdownToHtml(text ?? ""));
    console.log(markdownToHtml(text ?? ""));
  }, [text, editor]);

  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  );
}
