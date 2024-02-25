"use client";

import React, { useEffect, useState, useRef } from "react";
import AnnotatePage from "~/app/_components/Annotate/AnnotatePage";
import type { Project } from "@prisma/client";
import type { AnnotationType } from "~/app/_components/Annotate/AnnotatePage";
import SystemPromptForm from "~/app/_components/Annotate/SystemPromptForm";
import { Card } from "~/components/ui/card";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { ChevronsUpDown, Info, Minus, Plus } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";

function Annotate({ params }: { params: { projectId: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [systemPrompts, setSystemPrompts] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [annotatePages, setAnnotatePages] = useState<JSX.Element[]>([]);
  const [pageClicked, setPageClicked] = useState<boolean[]>([]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.projectId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch project");
        }
        const data = (await response.json()) as Project;
        setProject(data);
        setSystemPrompts(data.systemPrompts);
        const clickedArray = Array(data.systemPrompts.length).fill(false);
        if (clickedArray.length > 0) {
          clickedArray[0] = true;
          setPageClicked(clickedArray);
        } else {
          setAnnotatePages([
            <div key="-1" className="mt-12">
              Project owner has not created any system prompts.
            </div>,
          ]);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };
    void fetchProject();
  }, [params.projectId]);

  useEffect(() => {
    if (project && project !== undefined && systemPrompts.length > 0) {
      const pages = systemPrompts.map((prompt, index) => (
        <AnnotatePage
          key={index}
          idx={index}
          pageClicked={pageClicked}
          type={project.annotation as AnnotationType}
          prompt={prompt}
          projectId={params.projectId}
        />
      ));
      setAnnotatePages(pages);
    }
  }, [systemPrompts, activeIndex, project, params.projectId]);

  const handleStepClick = (index: number) => {
    setPageClicked((prevPageClicked) => {
      const newPageClicked = [...prevPageClicked];
      if (index >= 0 && index < newPageClicked.length) {
        newPageClicked[index] = true;
      }
      return newPageClicked;
    });
    setActiveIndex(index);
  };

  const [submitInstrs, setSubmitInstrs] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState<boolean>(true);

  const submitted = () => {
    setSubmitInstrs(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {project &&
        (!submitInstrs ? (
          <>
            <SystemPromptForm
              submit={submitted}
              prompt={project.instructions}
            />
          </>
        ) : (
          <div>
            <Card className={"fixed	left-5 top-5 max-h-[95vh] w-64 px-2"}>
              <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                  <div className="group flex cursor-pointer items-center justify-between px-2 py-4">
                    <h2 className="w-full cursor-pointer font-semibold transition-all">
                      Questions
                    </h2>
                    <ChevronsUpDown
                      size={32}
                      className="h-4 w-4 rounded-sm text-gray-800 group-hover:opacity-70"
                    />
                  </div>
                </CollapsibleTrigger>
                {isOpen && <hr></hr>}

                <CollapsibleContent className="bg-white">
                  <ul className="my-1 flex max-h-[85vh] resize-y flex-col gap-1 overflow-y-auto pb-4">
                    {systemPrompts.map((prompt, index) => (
                      <div key={index} className="flex flex-col gap-1">
                        <li
                          className={
                            "w-full cursor-pointer rounded-md p-2 transition-all" +
                            (activeIndex === index
                              ? " bg-blue-600 text-white hover:bg-blue-600"
                              : " hover:bg-gray-100")
                          }
                          key={index}
                          onClick={() => handleStepClick(index)}
                        >
                          Question {index + 1}
                        </li>
                        <hr className="w-11/12 self-center"></hr>
                      </div>
                    ))}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            <div className="mx-auto w-[53%]">
              {annotatePages.map((page, index) => (
                <div
                  key={index}
                  style={{ display: index === activeIndex ? "block" : "none" }}
                >
                  {page}
                </div>
              ))}
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Info
                  size={24}
                  className="fixed right-5 top-5 cursor-pointer rounded-full text-gray-600 transition-all hover:opacity-70"
                />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Instructions</SheetTitle>
                </SheetHeader>
                <p>{project.instructions}</p>
              </SheetContent>
            </Sheet>
          </div>
        ))}
    </div>
  );
}

export default Annotate;
