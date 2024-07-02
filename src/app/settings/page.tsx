"use client";

import React from "react";
import Layout from "../_components/Dashboard/Layout";
import SettingsPage from "../_components/SettingsPage";
import pageAccessHOC from "../_components/PageAccess";

function Settings() {
  return (
    <div className="bg-gray-50 dark:bg-neutral-900">
      <Layout>
        <SettingsPage />
      </Layout>
    </div>
  );
}

export default pageAccessHOC(Settings);
