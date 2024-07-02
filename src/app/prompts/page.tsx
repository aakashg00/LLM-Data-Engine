"use client";

import React from "react";
import Layout from "../_components/Dashboard/Layout";
import PromptsPage from "../_components/PromptsPage";
import pageAccessHOC from "../_components/PageAccess";

function Prompts() {
  return (
    <div className="bg-gray-50 dark:bg-neutral-900">
      <Layout>
        <PromptsPage />
      </Layout>
    </div>
  );
}

export default pageAccessHOC(Prompts);
