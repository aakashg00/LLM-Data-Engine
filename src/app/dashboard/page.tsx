"use client";

import React from "react";
import DashboardHome from "../_components/Dashboard/DashboardHome";
import Layout from "../_components/Dashboard/Layout";
import pageAccessHOC from "../_components/PageAccess";

function DashboardPage() {
  return (
    <div className="bg-gray-50 dark:bg-neutral-900">
      <Layout>
        <DashboardHome />
      </Layout>
    </div>
  );
}

export default pageAccessHOC(DashboardPage);
