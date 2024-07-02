import React from "react";
import AnnotateEditor from "./AnnotateEditor";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Info } from "lucide-react";

type Props = {
  text: string | undefined;
  submit: (
    annotations: Record<
      string,
      { start: number; end: number; text?: string | undefined }[]
    >,
  ) => void;
};

function TextAnnotateWrapper({ text, submit }: Props) {
  return (
    <div>
      <div className="mx-auto flex w-full flex-col gap-1 rounded-md border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-slate-900 dark:shadow-slate-700/[.7] md:p-5">
        <h2 className="m-0 p-0 text-lg font-bold text-gray-800 dark:text-white">
          Annotate the response.
        </h2>
        <p className="m-0 flex items-center gap-1 p-0 text-gray-500 dark:text-gray-400">
          Choose different tags from the dropdown menu and highlight relevant
          text.
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info
                  size={16}
                  className="cursor-pointer transition-all hover:opacity-70"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Tip: You can remove annotations by clicking on the annotated
                  text.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </p>

        <div className="flex flex-col gap-5">
          <AnnotateEditor text={text} submit={submit} />
        </div>
      </div>
    </div>
  );
}

export default TextAnnotateWrapper;
