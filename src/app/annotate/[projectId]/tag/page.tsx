"use client";

import React, { useEffect, useState } from "react";
import AnnotatePage from "~/app/_components/Annotate/AnnotatePage";
import type { Project } from "@prisma/client";

function Annotate({ params }: { params: { projectId: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [systemPrompts, setSystemPrompts] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [annotatePages, setAnnotatePages] = useState<JSX.Element[]>([]);

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
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };
    void fetchProject();
  }, [params.projectId]);

  useEffect(() => {
    const pages = systemPrompts.map((prompt, index) => (
      <AnnotatePage
        key={index}
        type="TAG"
        prompt={prompt}
        projectId={params.projectId}
      />
    ));
    setAnnotatePages(pages);
  }, [systemPrompts, activeIndex]);

  const handleStepClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div>
      {project && (
        <div>
          <ul className="flex gap-3">
            {systemPrompts.map((prompt, index) => (
              <li
                className={
                  "cursor-pointer rounded-md border p-2 font-bold transition-all" +
                  (activeIndex === index ? " bg-blue-600 text-white" : "")
                }
                key={index}
                onClick={() => handleStepClick(index)}
              >
                {index + 1}
              </li>
            ))}
          </ul>
          <div>
            {annotatePages.map((page, index) => (
              <div
                key={index}
                style={{ display: index === activeIndex ? "block" : "none" }}
              >
                {page}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Annotate;
