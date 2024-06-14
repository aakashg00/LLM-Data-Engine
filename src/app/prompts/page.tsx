"use client";

import React from "react";
import Layout from "../_components/Dashboard/Layout";
import PromptsPage from "../_components/PromptsPage";

function Prompts() {
  return (
    <div className="bg-gray-50 dark:bg-neutral-900">
      <Layout>
        <PromptsPage />
      </Layout>
    </div>
  );
}

export default Prompts;
