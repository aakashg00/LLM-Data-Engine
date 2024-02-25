import React from "react";
import { Check } from "lucide-react";

function SessionEnded() {
  return (
    <div>
      <div className="mx-auto flex w-full flex-row items-center justify-start gap-3 rounded-md border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-slate-900 dark:shadow-slate-700/[.7] md:p-5">
        <Check />
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          Session ended.
        </h2>
      </div>
    </div>
  );
}

export default SessionEnded;
