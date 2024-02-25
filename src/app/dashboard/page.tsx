"use client";

import React from "react";
import { useState } from "react";
import DialogueTable from "../_components/Project/DialogueTable";
import DashboardHome from "../_components/Dashboard/DashboardHome";

function DashboardPage() {
  return (
    <div className="bg-gray-50 dark:bg-neutral-900">
      <div>
        <DashboardHome />
      </div>
    </div>
  );
}

export default DashboardPage;
