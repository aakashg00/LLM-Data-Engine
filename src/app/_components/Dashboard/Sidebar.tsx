import React, { useState } from "react";
import Link from "next/link";
import { Home, Settings, SquarePen, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";

function Sidebar() {
  const [selectedPage, setSelectedPage] = useState<
    "dashboard" | "settings" | "prompts"
  >("dashboard");

  return (
    <>
      <aside className="fixed inset-y-0 start-0 z-[5] hidden w-[260px] transform border-e border-gray-200 bg-white duration-300 dark:border-neutral-700 dark:bg-neutral-800 md:bottom-0 md:end-auto md:block md:transition-all">
        <div className="flex h-full max-h-full flex-col p-5 py-3 text-sm">
          {/* <nav className="grid items-start px-2 text-sm font-medium md:px-4"> */}
          <header className="px-3 py-5">
            <h1 className="text-3xl font-extrabold text-primary dark:text-white">
              LLM Data Engine
              <span className="text-blue-700">.</span>
            </h1>
            {/* End Logo */}
          </header>
          <hr></hr>
          <div className="my-4">
            <Link
              href="/dashboard"
              onClick={() => setSelectedPage("dashboard")}
              className={
                "flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary" +
                (selectedPage === "dashboard" ? " bg-muted" : "")
              }
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/prompts"
              onClick={() => setSelectedPage("prompts")}
              className={
                "flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary" +
                (selectedPage === "prompts" ? " bg-muted" : "")
              }
            >
              <SquarePen className="h-4 w-4" />
              Prompts
            </Link>
            <Link
              href="#"
              onClick={() => setSelectedPage("settings")}
              className={
                "flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary" +
                (selectedPage === "settings" ? " bg-muted" : "")
              }
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
          <hr></hr>
        </div>
      </aside>
      <div className="-mb-2 pl-2 pt-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
              <Menu className="" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex w-[260px] flex-col">
            <aside className="fixed inset-y-0 end-auto start-0 z-[5] block w-[260px] transform border-e border-gray-200 bg-white transition-all duration-300 dark:border-neutral-700 dark:bg-neutral-800 md:bottom-0">
              <div className="flex h-full max-h-full flex-col p-5 py-3 text-sm">
                {/* <nav className="grid items-start px-2 text-sm font-medium md:px-4"> */}
                <header className="px-3 py-5">
                  <h1 className="text-3xl font-extrabold text-primary dark:text-white">
                    LLM Data Engine
                    <span className="text-blue-700">.</span>
                  </h1>
                  {/* End Logo */}
                </header>
                <hr></hr>
                <div className="my-4">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary"
                  >
                    <Home className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/prompts"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary"
                  >
                    <SquarePen className="h-4 w-4" />
                    Prompts
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </div>
                <hr></hr>
              </div>
            </aside>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export default Sidebar;
