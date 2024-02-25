import React from "react";
import { Project } from "@prisma/client";
import { Check, Clipboard, LinkIcon, Link2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import Link from "next/link";

interface Props {
  project: Project;
}

function ProjectTile({ project }: Props) {
  const [linkModalOpen, setLinkModalOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyClick = () => {
    void navigator.clipboard.writeText(`localhost:3000/annotate/${project.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

  return (
    <div>
      <div className="align-end flex h-36 flex-col items-end justify-between rounded-xl border border-gray-200 bg-white p-4 font-semibold text-slate-700 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
        <div onClick={() => setLinkModalOpen(true)}>
          <LinkIcon
            className="cursor-pointer transition-all hover:opacity-70"
            size={18}
          />
        </div>

        <Dialog open={linkModalOpen} onOpenChange={setLinkModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Here&apos;s your shareable URL</DialogTitle>
            </DialogHeader>
            <div className="flex items-center border-gray-300 pl-2">
              <Link2 size={22} />
              <Input
                type="text"
                value={`localhost:3000/annotate/${project.id}`}
                className="ml-2 flex-1 rounded-r-md border p-2"
                readOnly
              />
              <div
                className="ml-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-blue-500 bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleCopyClick}
              >
                {copied ? <Check size={20} /> : <Clipboard size={20} />}
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <div>
          <a href={`/projects/${project.id}`}>
            <h1 className="cursor-pointer text-right transition-all hover:opacity-70">
              {project.name}
            </h1>
          </a>
        </div>
      </div>
    </div>
  );
}

export default ProjectTile;
