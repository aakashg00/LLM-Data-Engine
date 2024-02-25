import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";

import type { Project, Tag } from "@prisma/client";
import toast from "react-hot-toast";
import { Link2, Clipboard, Check } from "lucide-react";
import { useState, useRef } from "react";

import type { AnnotationType } from "../Annotate/AnnotatePage";
import TagSelect, { TagNoID } from "./TagSelect";

export interface ProjectBody {
  id: string;
  createdAt: Date;
  name: string;
  description: string;
  instructions: string;
  annotation: AnnotationType;
  systemPrompts: string[];
  // tags: TagNoID[];
}
interface Props {
  project: ProjectBody;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
}

const ProjectDetails: React.FC<Props> = ({ project, setProject }: Props) => {
  const updateName = (newName: string) => {
    const updatedProject: ProjectBody = { ...project, name: newName };
    setProject(updatedProject);
  };

  const checkboxValues = useRef({
    edit: project.annotation === "EDIT" || project.annotation === "BOTH",
    tag: project.annotation === "TAG" || project.annotation === "BOTH",
  });

  const handleEditCheckboxChange = () => {
    checkboxValues.current = {
      edit: !checkboxValues.current.edit,
      tag: checkboxValues.current.tag,
    };
    const annotation = checkboxValues.current.edit
      ? checkboxValues.current.tag
        ? "BOTH"
        : "EDIT"
      : "TAG";
    console.log(checkboxValues.current);
    console.log(annotation);
    const updatedProject: ProjectBody = { ...project, annotation };
    setProject(updatedProject);
  };

  const handleTagCheckboxChange = () => {
    checkboxValues.current = {
      edit: checkboxValues.current.edit,
      tag: !checkboxValues.current.tag,
    };
    const annotation = checkboxValues.current.edit
      ? checkboxValues.current.tag
        ? "BOTH"
        : "EDIT"
      : "TAG";
    const updatedProject: ProjectBody = { ...project, annotation };
    setProject(updatedProject);
  };

  const updateDescription = (newDescription: string) => {
    const updatedProject: ProjectBody = {
      ...project,
      description: newDescription,
    };
    setProject(updatedProject);
  };

  const updateInstructions = (newInstructions: string) => {
    const updatedProject: ProjectBody = {
      ...project,
      instructions: newInstructions,
    };
    setProject(updatedProject);
  };

  // const updateTags = (tags: TagNoID[]) => {
  //   const updatedProject: ProjectBody = {
  //     ...project,
  //     tags: tags,
  //   };
  //   setProject(updatedProject);
  // };

  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyClick = () => {
    void navigator.clipboard.writeText(`localhost:3000/annotate/${project.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

  const submitSaveChanges = async () => {
    if (
      checkboxValues.current.tag === false &&
      checkboxValues.current.edit === false
    ) {
      throw new Error("At least one annotation type is required.");
    }
    const response = await fetch(`/api/projects/${project.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: project.name,
        systemPrompts: project.systemPrompts,
        description: project.description,
        annotation: project.annotation as AnnotationType,
        instructions: project.instructions,
        // tags: project.tags,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create project.");
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-start justify-start gap-1 md:grid md:grid-cols-12 md:gap-4">
          <div className="col-span-3">
            <Label htmlFor="projectName" className="text-gray-700">
              Project Name
            </Label>
          </div>
          <div className="w-full md:col-span-9">
            <Input
              type="text"
              name="projectName"
              id="projectName"
              className="min-w-full px-2 md:col-span-3"
              value={project.name}
              onChange={(e) => updateName(e.target.value)}
            />
          </div>
          <div className="col-span-3">
            <Label htmlFor="description" className="text-gray-700">
              Description
            </Label>
          </div>
          <div className="w-full md:col-span-9">
            <textarea
              name="description"
              id="description"
              className="h-22 min-h-14 w-full rounded-md border border-gray-300 bg-white p-2 text-sm"
              value={project.description}
              onChange={(e) => updateDescription(e.target.value)}
            />
          </div>
          <div className="col-span-3">
            <Label htmlFor="annotation" className="text-gray-700">
              Annotation Type(s)
            </Label>
          </div>
          <div className="col-span-9 flex flex-col gap-3 pt-1">
            <div className="flex space-x-2">
              <Checkbox
                id="edit"
                checked={checkboxValues.current.edit}
                onCheckedChange={handleEditCheckboxChange}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="edit"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Edit text
                </label>
                <p className="text-sm text-muted-foreground">
                  Users can directly edit AI-generated responses.
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Checkbox
                id="tag"
                checked={checkboxValues.current.tag}
                onCheckedChange={handleTagCheckboxChange}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="tag"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Tag text
                </label>
                <p className="text-sm text-muted-foreground">
                  Users can highlight sections of AI-generated responses and
                  label them with tags.
                </p>
              </div>
            </div>
          </div>
          {/* <div className="col-span-3">
            <Label htmlFor="instructions" className="text-gray-700">
              Tags
            </Label>
          </div> */}
          {/* <div className="col-span-9">
            <TagSelect tags={project.tags} setTags={updateTags} />
          </div> */}
          <div className="col-span-3">
            <Label htmlFor="instructions" className="text-gray-700">
              Instructions
            </Label>
          </div>
          <div className="w-full md:col-span-9">
            <textarea
              name="instructions"
              id="instructions"
              className="h-22 min-h-14 w-full rounded-md border border-gray-300 bg-white p-2 text-sm"
              value={project.instructions}
              onChange={(e) => updateInstructions(e.target.value)}
            />
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
      <Card>
        <CardHeader>
          <CardTitle>Shareable URL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center border-gray-300 pl-2">
            <Link2 size={22} />
            <Input
              type="text"
              value={`localhost:3000/annotate/${project.id}`}
              className="ml-2 flex-1 rounded-r-md border p-2"
              readOnly
            />
            <div
              className="ml-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-blue-500 bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleCopyClick}
            >
              {copied ? <Check size={20} /> : <Clipboard size={20} />}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Delete Project{" "}
            <Button
              variant="destructive"
              className="px-8"
              onClick={() =>
                toast.promise(submitSaveChanges(), {
                  loading: "Saving changes...",
                  success: "Success!",
                  error: (err: Error) => <p>{err.message}</p>,
                })
              }
            >
              Delete
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>
    </>
  );
};

export default ProjectDetails;
