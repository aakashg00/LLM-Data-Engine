import React, { useState } from "react";
import {
  TextAnnotateBlend,
  type AnnotateBlendTag,
} from "react-text-annotate-blend";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

type Props = {
  text: string | undefined;
  submit: (
    annotations: Record<
      string,
      { start: number; end: number; text?: string | undefined }[]
    >,
  ) => void;
};

function groupByTag(annotations: AnnotateBlendTag[]) {
  return annotations.reduce(
    (acc, annotation) => {
      const { tag, start, end, text } = annotation;

      // Ensure tag is defined before adding to the result
      if (tag) {
        if (!acc[tag]) {
          acc[tag] = [];
        }
        acc[tag].push({ start, end, text });
      }

      return acc;
    },
    {} as Record<string, { start: number; end: number; text?: string }[]>,
  );
}

export default function AnnotateEditor({ text, submit }: Props) {
  const [value, setValue] = useState<AnnotateBlendTag[]>([]);
  const [tag, setTag] = React.useState("Helpful");

  type COLOR_TYPE = {
    [key: string]: string;
    Helpful: string;
    "Above and Beyond": string;
    "Not Helpful": string;
    Inaccurate: string;
  };

  const handleChange = (value: AnnotateBlendTag[]) => {
    setValue(value);
  };

  const COLORS: COLOR_TYPE = {
    Helpful: "#02ad35",
    "Above and Beyond": "#e3cc02",
    "Not Helpful": "#d92b00",
    Inaccurate: "#048bc4",
  };
  const [submitted, setSubmitted] = useState<boolean>(false);

  function submitChange() {
    setSubmitted(true);
    const annotations = groupByTag(value);
    submit(annotations);
  }

  return (
    <div className={"mt-3" + (submitted ? " pointer-events-none" : "")}>
      <Select onValueChange={(val: string) => setTag(val)}>
        <SelectTrigger className="w-fit">
          <SelectValue
            placeholder={
              <div className="mr-2 flex items-center gap-2 overflow-hidden">
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "2px",
                    backgroundColor: COLORS.Helpful,
                  }}
                ></span>

                {"Helpful"}
              </div>
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Object.keys(COLORS).map((label) => (
              <SelectItem key={label} value={label}>
                <div className="mr-2 flex items-center gap-2 overflow-hidden">
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "2px",
                      backgroundColor: COLORS[label],
                    }}
                  ></span>

                  {label}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="my-3 flex flex-col justify-stretch rounded-md border">
        <TextAnnotateBlend
          className="text-md h-[150px] max-h-[150px] overflow-y-auto border-input p-3"
          content={text ?? ""}
          onChange={handleChange}
          value={value}
          getSpan={(span) => ({
            ...span,
            tag: tag,
            color: COLORS[tag],
          })}
        />
      </div>
      <div className={submitted ? "hidden" : "flex flex-row justify-end gap-3"}>
        <Popover>
          <PopoverTrigger asChild>
            <button className="inline-flex items-center justify-center gap-x-2 rounded-lg border border-transparent bg-gray-200 px-3 py-2 text-sm font-semibold hover:bg-gray-300 disabled:pointer-events-none disabled:opacity-50 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
              Preview Annotations
            </button>
          </PopoverTrigger>

          <PopoverContent className="w-80">
            <div>
              {/* {JSON.stringify(groupByTag(value), null, 2)} */}

              {Object.keys(groupByTag(value)).length > 0 ? (
                Object.keys(groupByTag(value)).map((tag) => (
                  <div key={tag} style={{ marginBottom: "16px" }}>
                    <div className="flex items-center gap-2">
                      <div
                        style={{
                          display: "inline-block",
                          width: "10px",
                          height: "10px",
                          borderRadius: "2px",
                          backgroundColor: COLORS[tag],
                        }}
                      ></div>
                      <strong>{tag}:</strong>
                    </div>
                    <div style={{ marginLeft: "16px" }}>
                      <ul>
                        {groupByTag(value)[tag]?.map((value, index) => (
                          <li key={index}>&quot;{value.text}&quot;</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-center">No annotations yet.</div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <button
          onClick={() => submitChange()}
          className="inline-flex items-center justify-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
