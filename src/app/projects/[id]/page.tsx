"use client";

import React, { useState, useEffect, useRef } from "react";
import Layout from "~/app/_components/Dashboard/Layout";
import { toast } from "react-hot-toast";
import { Project } from "@prisma/client";
import ProjectDetails from "~/app/_components/Project/ProjectDetails";
import DialogueTable from "~/app/_components/Project/DialogueTable";
import Prompts from "~/app/_components/Project/Prompts";

function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  type PageType = "details" | "prompts";
  const [curPage, setCurPage] = useState<PageType>("details");
  const loading = useRef<boolean>(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch project");
        }
        const data = (await response.json()) as Project;
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
        throw new Error("Failed to fetch project");
      }
    };

    if (project === null && loading.current) {
      loading.current = false;
      void toast.promise(fetchProject(), {
        loading: "Loading project data...",
        success: "Success!",
        error: (err: Error) => <p>{err.message}</p>,
      });
    }
  }, [params.id, project]);

  return (
    <Layout>
      <main id="content" role="main" className="md:ps-[260px]">
        <div className="min-h-screen space-y-5 bg-gray-50 p-5">
          <div className="flex max-w-fit gap-3">
            <div
              className={
                "cursor-pointer rounded-md border border-gray-200 px-4 py-2 text-sm" +
                (curPage === "details"
                  ? " border bg-white shadow-sm transition-all"
                  : " text-gray-700")
              }
              key={0}
              onClick={() => setCurPage("details")}
            >
              Details
            </div>
            <div
              className={
                "cursor-pointer rounded-md border border-gray-200 px-4 py-2 text-sm" +
                (curPage === "prompts"
                  ? " border bg-white shadow-sm transition-all"
                  : " text-gray-700")
              }
              key={0}
              onClick={() => setCurPage("prompts")}
            >
              Prompts
            </div>
          </div>
          {project && (
            <>
              {curPage === "details" && (
                <ProjectDetails project={project} setProject={setProject} />
              )}
              {curPage === "prompts" && (
                <Prompts project={project} setProject={setProject} />
              )}
            </>
          )}{" "}
        </div>
      </main>
    </Layout>
  );
}

export default ProjectPage;
