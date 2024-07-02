import React, { useState } from "react";
import type { Project, SystemPrompt } from "@prisma/client";
import { Label } from "~/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import toast from "react-hot-toast";
import pageAccessHOC from "../PageAccess";
import { ProjectBody } from "~/app/projects/[id]/page";

interface Props {
  project: ProjectBody;
  setProject: React.Dispatch<React.SetStateAction<ProjectBody | null>>;
}

function Prompts({ project, setProject }: Props) {
  const deleteSystemPrompt = (indexToDelete: number) => {
    const updatedSystemPrompts = project.systemPrompts.filter(
      (_, index) => index !== indexToDelete,
    );
    const updatedProject = {
      ...project,
      systemPrompts: updatedSystemPrompts,
    };
    setProject(updatedProject);
  };

  const handleSystemPromptTitleChange = (index: number, value: string) => {
    const updatedSystemPrompts = [...project.systemPrompts];
    if (updatedSystemPrompts?.[index]) {
      console.log(updatedSystemPrompts);
      updatedSystemPrompts[index].title = value;
      const updatedProject = {
        ...project,
        systemPrompts: updatedSystemPrompts,
      };
      setProject(updatedProject);
    }
  };

  const handleSystemPromptBodyChange = (index: number, value: string) => {
    const updatedSystemPrompts = [...project.systemPrompts];
    if (updatedSystemPrompts?.[index]) {
      updatedSystemPrompts[index].body = value;
      const updatedProject = {
        ...project,
        systemPrompts: updatedSystemPrompts,
      };
      setProject(updatedProject);
    }
  };

  const addSystemPrompt = () => {
    const updatedProject: ProjectBody = {
      ...project,
      systemPrompts: [...project.systemPrompts, { title: "", body: "" }],
    };
    setProject(updatedProject);
  };

  const submitSaveChanges = async () => {
    const response = await fetch(`/api/projects/${project.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: project.name,
        systemPrompts: project.systemPrompts,
        description: project.description,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create project");
    }
  };

  return (
    <div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>System Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          {project.systemPrompts.map((prompt, index) => (
            <div key={index} className="flex w-full items-start gap-8">
              <h6 className="mb-1 text-gray-800">{index + 1}.</h6>
              <div className="flex w-full flex-col gap-2">
                <Label
                  htmlFor={`systemPromptTitle-${index}`}
                  // className="block text-sm font-medium text-gray"
                >
                  Title
                </Label>
                <input
                  id={`systemPromptTitle-${index}`}
                  className="mb-1 w-full rounded-md border border-gray-300 p-2 text-sm text-slate-700"
                  value={prompt.title}
                  onChange={(e) =>
                    handleSystemPromptTitleChange(index, e.target.value)
                  }
                />

                <Label
                  htmlFor={`systemPromptTitle-${index}`}
                  // className="block text-sm font-medium text-gray"
                >
                  Body
                </Label>

                <div className="flex flex-col items-end gap-1">
                  <textarea
                    id={`systemPrompt-${index}`}
                    className="h-22 min-h-14 w-full rounded-md border border-gray-300 p-2 text-sm text-slate-700"
                    value={prompt.body}
                    onChange={(e) =>
                      handleSystemPromptBodyChange(index, e.target.value)
                    }
                  />
                  {project.systemPrompts.length > 1 && (
                    <div className="flex h-full items-center">
                      <button
                        type="button"
                        onClick={() => deleteSystemPrompt(index)}
                        className="text-slate-500 transition-all hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="mt-2 flex w-max items-center gap-1 transition-all hover:cursor-pointer hover:opacity-70">
            <Plus size={20} />
            <p className="text-sm" onClick={addSystemPrompt}>
              Add System Prompt
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            className="float-end"
            onClick={() =>
              toast.promise(submitSaveChanges(), {
                loading: "Saving changes...",
                success: "Success!",
                error: (err: Error) => <p>{err.message}</p>,
              })
            }
          >
            Save changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Prompts;
