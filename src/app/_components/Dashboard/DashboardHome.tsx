import React, { useState, useEffect, useRef } from "react";
import type { Project } from "@prisma/client";
import ProjectTile from "./ProjectTile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { toast } from "react-hot-toast";
import Layout from "./Layout";
import { Textarea } from "~/components/ui/textarea";
import { HelpCircle, MessageCircleQuestion, Plus } from "lucide-react";
import Link from "next/link";

export type DashboardProject = {
  id: string;
  name: string;
};

function DashboardHome() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [projectName, setProjectName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [publicKey, setPublicKey] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");

  const [projects, setProjects] = useState<Project[] | null>(null);

  const loading = useRef<boolean>(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = (await response.json()) as Project[];
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    if (projects === null && loading.current) {
      loading.current = false;
      void toast.promise(fetchProjects(), {
        loading: "Loading projects...",
        success: "Success!",
        error: (err: Error) => <p>{err.message}</p>,
      });
    }
  }, [projects]);

  const handleClickedSubmit = async (project?: Project) => {
    try {
      if (projectName === "") {
        throw new Error("Please enter a project name.");
      }

      if (description === "") {
        throw new Error("Please enter a description.");
      }
      if (publicKey === "") {
        throw new Error("Please enter your public key.");
      }
      if (secretKey === "") {
        throw new Error("Please enter your secret key.");
      }
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectName,
          description,
          publicKey,
          secretKey,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const data = (await response.json()) as Project;

      setIsModalOpen(false);
      setProjects([...(projects ?? []), data]);
      setProjectName("");
      setDescription("");
      setPublicKey("");
      setSecretKey("");
    } catch (error) {
      console.error("Error creating project:", error);
      throw new Error((error as Error).message);
    }
  };

  const handlePressedCreate = () => {
    setProjectName("");
    setDescription("");
    setPublicKey("");
    setSecretKey("");
    setIsModalOpen(true);
  };

  return (
    <div>
      <main id="content" role="main" className="md:ps-[260px]">
        <div className="flex min-h-screen flex-col space-y-5 p-5">
          {/* Page Header  */}
          <div className="flex h-10 items-center justify-between gap-x-5">
            <h2 className="inline-block text-lg font-semibold text-gray-800 dark:text-neutral-200">
              Dashboard
            </h2>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={handlePressedCreate}
                  variant="default"
                  size="icon"
                >
                  <Plus />
                </Button>
                {/* <button
              className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
             
            >
              
            </button> */}
              </DialogTrigger>
              <DialogContent className="max-h-screen overflow-y-scroll sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create a project.</DialogTitle>
                  <DialogDescription>
                    Write a name and description for your project.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3 overflow-auto">
                  <Label
                    htmlFor="projectName"
                    // className="-mb-3 block text-sm font-medium text-gray-700"
                  >
                    Project Name
                  </Label>
                  <Input
                    type="text"
                    name="projectName"
                    id="projectName"
                    className="col-span-3 -mt-2"
                    // className="w-full rounded-md border border-gray-300 p-2 text-sm text-slate-700"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                  <Label
                    htmlFor="description"
                    // className="-mb-3 block text-sm font-medium text-gray-700"
                  >
                    Description
                  </Label>
                  <Textarea
                    name="description"
                    id="description"
                    className="h-22 -mt-2 min-h-14 w-full rounded-md border border-gray-300 bg-white p-2 text-sm"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <Label
                    htmlFor="publickey"
                    className="flex items-center gap-1"
                  >
                    Langfuse Public Key
                    <Link
                      href="https://langfuse.com/docs/get-started"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <HelpCircle
                        className="text-gray-600 hover:cursor-pointer"
                        size={12}
                      />
                    </Link>
                  </Label>
                  <Input
                    type="text"
                    name="publickey"
                    id="publickey"
                    className="col-span-3 -mt-2"
                    // className="w-full rounded-md border border-gray-300 p-2 text-sm text-slate-700"
                    value={publicKey}
                    onChange={(e) => setPublicKey(e.target.value)}
                  />
                  <Label
                    htmlFor="secretkey"
                    className="flex items-center gap-1"
                  >
                    Langfuse Secret Key
                    <Link
                      href="https://langfuse.com/docs/get-started"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <HelpCircle
                        className="text-gray-600 hover:cursor-pointer"
                        size={12}
                      />
                    </Link>
                  </Label>
                  <Input
                    type="text"
                    name="secretkey"
                    id="secretkey"
                    className="col-span-3 -mt-2"
                    // className="w-full rounded-md border border-gray-300 p-2 text-sm text-slate-700"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  {/* <Button type="submit">Save changes</Button> */}
                  <Button
                    // className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    onClick={() =>
                      toast.promise(handleClickedSubmit(), {
                        loading: "Creating project...",
                        success: "Success!",
                        error: (err: Error) => <p>{err.message}</p>,
                      })
                    }
                  >
                    Submit
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          {/* End Page Header  */}
          {projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
              {(projects ?? []).map((project) => (
                <ProjectTile key={project.id} project={project} />
              ))}
            </div>
          ) : (
            !loading && (
              <div className="flex justify-center">
                <h2 className="flex items-center pt-12 text-3xl">
                  Create your first project!
                </h2>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}

export default DashboardHome;
