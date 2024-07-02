"use client";

import React, { useEffect, useState } from "react";
import AnnotatePage from "~/app/_components/Annotate/AnnotatePage";
import type { AnnotationType } from "~/app/_components/Annotate/AnnotatePage";
import SystemPromptForm from "~/app/_components/Annotate/SystemPromptForm";
import { Card } from "~/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import {
  BookOpenText,
  Check,
  CheckCircle,
  CheckCircle2,
  ChevronsUpDown,
  Info,
  MinusCircle,
  RefreshCw,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import pageAccessHOC from "~/app/_components/PageAccess";
import { useSession, signOut } from "next-auth/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import type { ProjectBody, SystemPrompt } from "~/app/projects/[id]/page";

function Annotate({ params }: { params: { projectId: string } }) {
  const [project, setProject] = useState<ProjectBody | null>(null);
  const [systemPrompts, setSystemPrompts] = useState<SystemPrompt[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [annotatePages, setAnnotatePages] = useState<JSX.Element[]>([]);
  const [pageClicked, setPageClicked] = useState<boolean[]>([]);
  const [resetCounter, setResetCounter] = useState<number[]>([]);
  const [sessionEnded, setSessionEnded] = useState<boolean[]>([]);

  const { data: session } = useSession();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.projectId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch project");
        }
        const data = (await response.json()) as ProjectBody;
        setProject(data);
        setSystemPrompts(data.systemPrompts);
        const clickedArray = Array(data.systemPrompts.length).fill(false);
        setResetCounter(Array(data.systemPrompts.length).fill(0) as number[]);
        setSessionEnded(Array(data.systemPrompts.length).fill(false));
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
          key={`${index}-${resetCounter[index]}`}
          idx={index}
          pageClicked={pageClicked}
          type={project.annotation as AnnotationType}
          promptBody={prompt.body}
          projectId={params.projectId}
          userId={session?.user.id ?? ""}
          resetConversation={incrementAtIndex}
          setSessionEnded={setSessionEnded}
        />
      ));
      setAnnotatePages(pages);
    }
  }, [systemPrompts, activeIndex, project, params.projectId, resetCounter]);

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

  const incrementAtIndex = (index: number) => {
    setSessionEnded((prevState) => {
      const updatedState = [...prevState];
      updatedState[index] = false;
      return updatedState;
    });
    setResetCounter((prevResetCounter) => {
      const updatedCounter = [...prevResetCounter] as number[];
      if (updatedCounter[index] !== undefined) {
        updatedCounter[index] += 1;
      }
      return updatedCounter;
    });
  };

  const [submitInstrs, setSubmitInstrs] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState<boolean>(true);

  const submitted = () => {
    setSubmitInstrs(true);
  };

  return (
    <div className="relative min-h-screen bg-gray-50 py-12">
      <Popover>
        <PopoverTrigger asChild>
          <img
            src={session?.user.image ?? ""}
            alt="User"
            className="fixed right-5 top-5 h-10 w-10 cursor-pointer rounded-full border border-gray-300 transition-all hover:opacity-70"
          />
        </PopoverTrigger>

        <PopoverContent className="flex max-w-56 flex-col gap-3">
          <span>
            <p className="max-w-36 overflow-x-scroll text-sm font-bold text-gray-700 dark:text-neutral-200">
              {session?.user.name}
            </p>
            <p className="max-w-36 overflow-x-scroll text-xs text-gray-500 dark:text-neutral-500">
              {session?.user.email}
            </p>
          </span>

          <hr></hr>
          <p
            onClick={() => signOut()}
            className="cursor-pointer text-center text-xs font-semibold text-gray-700 hover:text-red-600"
          >
            Sign out
          </p>
        </PopoverContent>
      </Popover>

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
                            "flex h-10 max-h-10 min-h-10 w-full cursor-pointer items-center justify-between overflow-x-scroll whitespace-nowrap rounded-md p-2 transition-all" +
                            (activeIndex === index
                              ? " bg-blue-600 text-white hover:bg-blue-600"
                              : " hover:bg-gray-100")
                          }
                          key={index}
                          onClick={() => handleStepClick(index)}
                        >
                          {`${index + 1}. ${prompt.title}`}
                          {sessionEnded[index] ? (
                            <Check className="text-green-600" size={16} />
                          ) : (
                            <MinusCircle className="text-red-600" size={16} />
                          )}
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
                  style={{
                    display: index === activeIndex ? "block" : "none",
                  }}
                >
                  {page}
                </div>
              ))}
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <BookOpenText
                  size={24}
                  className="fixed right-20 top-5 h-10 w-10 cursor-pointer p-1 text-gray-600 transition-all hover:opacity-70"
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

export default pageAccessHOC(Annotate);
