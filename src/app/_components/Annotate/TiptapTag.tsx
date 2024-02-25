import { useEditor, EditorContent, BubbleMenu, Mark } from "@tiptap/react";
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
import React, { useState, useRef } from "react";
import { Toolbar } from "./Toolbar";

import { mergeAttributes } from "@tiptap/react";

import Heading from "@tiptap/extension-heading";
import { htmlToMarkdown, markdownToHtml } from "./Parser";
import ControlledBubbleMenu from "./ControlledBubbleMenu";

type Props = {
  text: string | undefined;
  submit: (text: string | undefined, changed: boolean) => void;
};

type Indices = [number, number];
type FeedbackRefs = {
  helpful: Indices[];
  notHelpful: Indices[];
  inaccurate: Indices[];
  aboveAndBeyond: Indices[];
};

export interface UnderlineColorOptions {
  multicolor: boolean;
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    underlineColor: {
      setUnderlineColor: (attributes?: { color: string }) => ReturnType;
      toggleUnderlineColor: (attributes?: { color: string }) => ReturnType;
      unsetUnderlineColor: () => ReturnType;
    };
  }
}

export const UnderlineColor = Mark.create<UnderlineColorOptions>({
  name: "underlineColor",
  addOptions() {
    return {
      multicolor: false,
      HTMLAttributes: {},
    };
  },
  addAttributes() {
    if (!this.options.multicolor) {
      return {};
    }
    return {
      color: {
        default: null,
        parseHTML: (element) => undefined,
        renderHTML: (attributes) => {
          if (!attributes.color) {
            return {};
          }
          return {
            style: `text-decoration: underline; text-decoration-color: ${attributes.color}; text-decoration-thickness: 2px; text-underline-offset: 4px;`,
          };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "span",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
  addCommands() {
    return {
      setUnderlineColor:
        (attributes) =>
        ({ commands }) => {
          return commands.setMark(this.name, attributes);
        },
      toggleUnderlineColor:
        (attributes) =>
        ({ commands }) => {
          return commands.toggleMark(this.name, attributes);
        },
      unsetUnderlineColor:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});

export default function TiptapTag({ text, submit }: Props) {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const lowlight = createLowlight(all);

  const [shouldShow, setShouldShow] = useState<boolean>(false);

  const feedbackRef = useRef<FeedbackRefs>({
    helpful: [],
    notHelpful: [],
    inaccurate: [],
    aboveAndBeyond: [],
  });

  const updateFeedback = (
    key: keyof FeedbackRefs,
    start: number,
    end: number,
  ) => {
    const newPair: Indices = [start, end];
    const pairs = feedbackRef.current[key];
    let merged = false;
    let toRemoveIndex = -1;

    for (let i = 0; i < pairs.length; i++) {
      const currentPair = pairs[i];
      if (currentPair) {
        const [currentStart, currentEnd] = currentPair;

        // Check if new pair fully overlaps with existing pair
        if (start >= currentStart && end <= currentEnd) {
          toRemoveIndex = i;
          merged = true;
          break;
        }

        // Check for partial overlap or adjacency
        if (start <= currentEnd + 1 && end >= currentStart - 1) {
          pairs[i] = [Math.min(currentStart, start), Math.max(currentEnd, end)];
          merged = true;
          break;
        }
      }
    }

    if (!merged) {
      // Add new pair if it doesn't fully overlap any existing pair
      pairs.push(newPair);
    } else if (toRemoveIndex !== -1) {
      // Remove the pair that is fully overlapped by the new pair
      pairs.splice(toRemoveIndex, 1);
    }

    // Sort and merge overlapping pairs
    console.log("pairs", mergeAndSortPairs(pairs));
    feedbackRef.current[key] = mergeAndSortPairs(pairs);
  };

  const mergeAndSortPairs = (pairs: Indices[]): Indices[] => {
    // Filter out any undefined pairs
    const validPairs = pairs.filter(
      (pair): pair is Indices =>
        pair?.[0] !== undefined && pair?.[1] !== undefined,
    );

    if (validPairs.length <= 1) return validPairs;

    validPairs.sort((a, b) => a[0] - b[0]);
    const mergedPairs: Indices[] = [];

    mergedPairs.push(validPairs[0]!);

    for (let i = 1; i < validPairs.length; i++) {
      const lastPair = mergedPairs[mergedPairs.length - 1];
      const currentPair = validPairs[i];

      if (currentPair![0] <= lastPair![1]) {
        mergedPairs[mergedPairs.length - 1] = [
          Math.min(lastPair![0], currentPair![0]),
          Math.max(lastPair![1], currentPair![1]),
        ];
      } else {
        mergedPairs.push(currentPair!);
      }
    }

    return mergedPairs;
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
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
      UnderlineColor.configure({
        multicolor: true,
      }),
    ],
    content: text ?? "",
    editorProps: {
      attributes: {
        class: "text-sm p-3 min-h-[150px] border-input",
      },
      handleClickOn: (view, pos, node) => {
        console.log("node.attrs", node.attrs);
        console.log("pos", pos);
        console.log("node", node);
        console.log("clickOn");
      },
      handleClick: () => {
        console.log("click");
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

    const htmlContent = editor?.getHTML();
    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(htmlContent ?? "", "text/html");

    const underlinedElements = parsedHtml.querySelectorAll<HTMLElement>(
      'span[style*="text-decoration: underline;"]',
    );

    const underlinedTextData = Array.from(underlinedElements).map((element) => {
      const text = element.textContent ?? "";
      const color = element.style.textDecorationColor;
      return { text, color };
    });

    const colorTagMap: Record<string, string> = {
      "rgb(2, 173, 53)": "helpful",
      "rgb(227, 204, 2)": "above and beyond",
      "rgb(217, 43, 0)": "not helpful",
      "rgb(4, 139, 196)": "inaccurate",
    };

    const result: Record<string, string[]> = {};

    // Iterate through the data array
    underlinedTextData.forEach((item) => {
      const tag = colorTagMap[item.color]!;
      if (!result[tag ?? "unknown"]) {
        result[tag ?? "unknown"] = [];
      }
      result[tag ?? "unknown"]?.push(item.text);
    });

    console.log(result);

    const markdownContent = htmlToMarkdown(htmlContent);
    submit(markdownContent);
  }

  return (
    <div>
      <div className="mt-3 flex flex-col justify-stretch rounded-md border">
        {editor && (
          // && (
          //   <ControlledBubbleMenu editor={editor} open={shouldShow}>

          //   </ControlledBubbleMenu>
          // )

          <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 300, interactive: true }}
          >
            <div className="flex w-48 cursor-pointer flex-col rounded-lg bg-white py-2 font-sans text-xs text-gray-800 shadow-xl">
              <div
                onClick={() => {
                  editor
                    .chain()
                    .focus()
                    .toggleUnderlineColor({ color: "#02ad35" })
                    .run();
                  const { from, to } = editor.state.selection;
                  console.log("from", from);
                  console.log("to", to);
                  console.log(
                    "text selected",
                    editor.state.doc.textBetween(from, to, " "),
                  );
                  updateFeedback("helpful", from - 1, to - 1);

                  const htmlContent = editor?.getHTML();
                  const parser = new DOMParser();
                  const parsedHtml = parser.parseFromString(
                    htmlContent ?? "",
                    "text/html",
                  );

                  const underlinedElements =
                    parsedHtml.querySelectorAll<HTMLElement>(
                      'span[style*="text-decoration: underline;"]',
                    );

                  const underlinedTextData = Array.from(underlinedElements).map(
                    (element) => {
                      const text = element.textContent ?? "";
                      const color = element.style.textDecorationColor;
                      return { text, color };
                    },
                  );

                  const colorTagMap: Record<string, string> = {
                    "rgb(2, 173, 53)": "helpful",
                    "rgb(227, 204, 2)": "above and beyond",
                    "rgb(217, 43, 0)": "not helpful",
                    "rgb(4, 139, 196)": "inaccurate",
                  };

                  const result: Record<string, string[]> = {};

                  // Iterate through the data array
                  underlinedTextData.forEach((item) => {
                    const tag = colorTagMap[item.color]!;
                    if (!result[tag ?? "unknown"]) {
                      result[tag ?? "unknown"] = [];
                    }
                    result[tag ?? "unknown"]?.push(item.text);
                  });

                  console.log("result", result);
                }}
                className="flex w-full flex-row items-center gap-2 px-3 py-2 hover:bg-gray-50"
              >
                <div className="h-3 w-3 rounded-sm bg-[#02ad35]"></div>
                Helpful
              </div>
              <div
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleUnderlineColor({ color: "#e3cc02" })
                    .run()
                }
                className="flex w-full flex-row items-center gap-2 px-3 py-2 hover:bg-gray-50"
              >
                <div className="h-3 w-3 rounded-sm bg-[#e3cc02]"></div>
                Above and Beyond
              </div>
              <div
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleUnderlineColor({ color: "#d92b00" })
                    .run()
                }
                className="flex w-full flex-row items-center gap-2 px-3 py-2 hover:bg-gray-50"
              >
                <div className="h-3 w-3 rounded-sm bg-[#d92b00]"></div>
                Not Helpful
              </div>
              <div
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleUnderlineColor({ color: "#048bc4" })
                    .run()
                }
                className="flex w-full flex-row items-center gap-2 px-3 py-2 hover:bg-gray-50"
              >
                <div className="h-3 w-3 rounded-sm bg-[#048bc4]"></div>
                Inaccurate
              </div>
            </div>
          </BubbleMenu>
        )}
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
