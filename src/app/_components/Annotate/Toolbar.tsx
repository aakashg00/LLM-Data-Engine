"use client";

import { type Editor } from "@tiptap/react";
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Code2,
  Undo2,
  Redo2,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  Quote,
  Code,
  SquareCode,
} from "lucide-react";
import cn from "classnames";

type Props = {
  editor: Editor | null;
};

export function Toolbar({ editor }: Props) {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b-1 flex flex-row flex-wrap rounded-t-md border border-x-0 border-t-0 bg-gray-50">
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-2 transition hover:cursor-pointer hover:bg-gray-200"
      >
        <Undo2 />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-2 transition hover:cursor-pointer hover:bg-gray-200"
      >
        <Redo2 />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={cn(
          "rounded-tl-sm p-2 transition hover:cursor-pointer hover:bg-gray-200",
          {
            "bg-gray-200": editor.isActive("bold"),
          },
        )}
      >
        <Bold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={cn("p-2 transition hover:cursor-pointer hover:bg-gray-200", {
          "bg-gray-200": editor.isActive("italic"),
        })}
      >
        <Italic />
      </button>
      {/* <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={cn("p-2 transition hover:cursor-pointer hover:bg-gray-200", {
          "bg-gray-200": editor.isActive("strike"),
        })}
      >
        <Strikethrough />
      </button> */}
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className="p-2 transition hover:cursor-pointer hover:bg-gray-200"
      >
        <Pilcrow />
      </button>
      {/* 
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cn("p-2 transition hover:cursor-pointer hover:bg-gray-200", {
          "bg-gray-200": editor.isActive("heading", { level: 1 }),
        })}
      >
        <Heading />
      </button> */}

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cn("p-2 transition hover:cursor-pointer hover:bg-gray-200", {
          "bg-gray-200": editor.isActive("heading", { level: 1 }),
        })}
      >
        <Heading1 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn("p-2 transition hover:cursor-pointer hover:bg-gray-200", {
          "bg-gray-200": editor.isActive("heading", { level: 2 }),
        })}
      >
        <Heading2 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={cn("p-2 transition hover:cursor-pointer hover:bg-gray-200", {
          "bg-gray-200": editor.isActive("heading", { level: 3 }),
        })}
      >
        <Heading3 />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn("p-2 transition hover:cursor-pointer hover:bg-gray-200", {
          "bg-gray-200": editor.isActive("bulletList"),
        })}
      >
        <List />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn("p-2 transition hover:cursor-pointer hover:bg-gray-200", {
          "bg-gray-200": editor.isActive("orderedList"),
        })}
      >
        <ListOrdered />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={cn("p-2 transition hover:cursor-pointer hover:bg-gray-200", {
          "bg-gray-200": editor.isActive("code"),
        })}
      >
        <Code />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={cn("p-2 transition hover:cursor-pointer hover:bg-gray-200", {
          "bg-gray-200": editor.isActive("codeBlock"),
        })}
      >
        <SquareCode />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={cn("p-2 transition hover:cursor-pointer hover:bg-gray-200", {
          "bg-gray-200": editor.isActive("blockquote"),
        })}
      >
        <Quote />
      </button>
    </div>
  );
}
