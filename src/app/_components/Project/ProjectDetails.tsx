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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useRouter } from "next/navigation";

import type { Project, Tag } from "@prisma/client";
import toast from "react-hot-toast";
import { Link2, Clipboard, Check, Trash2 } from "lucide-react";
import { useState, useRef } from "react";

import type { AnnotationType } from "../Annotate/AnnotatePage";
import TagSelect, { TagNoID } from "./TagSelect";
import { router } from "@trpc/server";
import pageAccessHOC from "../PageAccess";
import type { ProjectBody } from "~/app/projects/[id]/page";
import { Badge } from "~/components/ui/badge";
interface Props {
  project: ProjectBody;
  setProject: React.Dispatch<React.SetStateAction<ProjectBody | null>>;
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

  const router = useRouter();

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

  async function deleteProject() {
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }
    } catch (error) {
      throw new Error("Faield to delete project");
    }
  }

  function handleDeleteProjectClick() {
    void toast.promise(deleteProject(), {
      loading: "Deleting project...",
      success: "Project deleted successfully!",
      error: (err) => <p>{err}</p>,
    });
    router.push("/dashboard");
  }

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
                  className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                  className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
          <CardTitle>Access Control</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-end gap-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Collaborator</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {project.users.map((user, index) => (
                <TableRow key={index} className="bg-accent">
                  <TableCell>
                    <div className="font-medium">{user.name}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {user.email}
                    </div>
                  </TableCell>

                  {index >= 0 && (
                    <TableCell className="hidden sm:table-cell">
                      <Trash2 className="float-right" />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Dialog>
            <DialogTrigger>
              <Button className="">Add a collaborator</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a collaborator.</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col">
                <Label htmlFor="collaboratorEmail" className="text-gray-700">
                  Email
                </Label>
              </div>
              <div className="w-full">
                <Input
                  type="email"
                  name="collaboratorEmail"
                  id="collaboratorEmail"
                  className="min-w-full px-2 "
                  value={project.name}
                  onChange={(e) => updateName(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button>Add</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Delete Project
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="px-8">
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="mb-1">
                    Are you sure you want to delete?
                  </DialogTitle>
                  <DialogDescription className="mb-2">
                    Deleting a project is final and cannot be undone.
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteProjectClick}
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
      </Card>
    </>
  );
};

export default pageAccessHOC(ProjectDetails);
