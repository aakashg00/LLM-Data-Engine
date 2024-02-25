import React, { useState } from "react";
import type { Project } from "@prisma/client";
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

interface Props {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
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

  const handleSystemPromptChange = (index: number, value: string) => {
    const updatedSystemPrompts = [...project.systemPrompts];
    updatedSystemPrompts[index] = value;
    const updatedProject = {
      ...project,
      systemPrompts: updatedSystemPrompts,
    };
    setProject(updatedProject);
  };

  const addSystemPrompt = () => {
    const updatedProject: Project = {
      ...project,
      systemPrompts: [...project.systemPrompts, ""],
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
            <div key={index}>
              <Label
                htmlFor={`systemPrompt-${index}`}
                // className="block text-sm font-medium text-gray"
              >
                System Prompt {index + 1}
              </Label>

              <div className="flex flex-col items-end gap-1">
                <textarea
                  id={`systemPrompt-${index}`}
                  className="h-22 min-h-14 w-full rounded-md border border-gray-300 p-2 text-sm text-slate-700"
                  value={prompt}
                  onChange={(e) =>
                    handleSystemPromptChange(index, e.target.value)
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
