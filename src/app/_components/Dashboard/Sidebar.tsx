import React, { useState } from "react";
import { Home, Settings, SquarePen, Menu, ChevronsUpDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

function Sidebar() {
  const pathname = usePathname().substring(1);
  const [selectedPage, setSelectedPage] = useState<
    "dashboard" | "settings" | "prompts"
  >(
    pathname === "dashboard" ||
      pathname === "settings" ||
      pathname === "prompts"
      ? pathname
      : "dashboard",
  );
  const router = useRouter();
  const { data: session } = useSession();

  const switchPage = (page: "dashboard" | "settings" | "prompts") => {
    setSelectedPage(page);
    router.push(`/${page}`);
  };

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
          <div className="flex h-full flex-col justify-between">
            <div>
              <hr></hr>
              <div className="my-4">
                <div
                  onClick={() => switchPage("dashboard")}
                  className={
                    "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary" +
                    (selectedPage === "dashboard" ? " bg-muted" : "")
                  }
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </div>
                <div
                  onClick={() => switchPage("prompts")}
                  className={
                    "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary" +
                    (selectedPage === "prompts" ? " bg-muted" : "")
                  }
                >
                  <SquarePen className="h-4 w-4" />
                  Prompts
                </div>
                <div
                  onClick={() => switchPage("settings")}
                  className={
                    "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary" +
                    (selectedPage === "settings" ? " bg-muted" : "")
                  }
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </div>
              </div>
              <hr></hr>
            </div>
            <div>
              {/*  Footer  */}
              <div className="absolute inset-x-0 bottom-0 border-t border-gray-200 dark:border-neutral-700">
                {/*  Account  */}
                {/*  Project Dropdown  */}
                {/*  Project Button  */}

                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      id="hs-pro-dnwpd"
                      type="button"
                      className="flex w-full items-center justify-between px-5 py-3 text-start align-middle text-gray-800 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                    >
                      <div className="flex justify-between gap-3">
                        <img
                          src={session?.user.image ?? ""}
                          alt=""
                          className="h-8 w-8 rounded-full border"
                        />
                        <span>
                          <p className="max-w-36 overflow-x-scroll text-sm font-bold text-gray-700 dark:text-neutral-200">
                            {session?.user.name}
                          </p>
                          <p className="max-w-36 overflow-x-scroll text-xs text-gray-500 dark:text-neutral-500">
                            {session?.user.email}
                          </p>
                        </span>
                      </div>
                      <ChevronsUpDown size={16} />
                    </button>
                  </PopoverTrigger>

                  <PopoverContent className="max-w-[260px]">
                    <div
                      className="h-full w-full cursor-pointer text-gray-700 hover:text-red-600"
                      onClick={() => signOut()}
                    >
                      <p className="text-center text-sm">Sign out</p>
                    </div>
                  </PopoverContent>
                </Popover>

                {/*  End Project Button  */}

                {/*  Dropdown  */}

                {/*  End Dropdown  */}
                {/*  End Project Dropdown  */}
                {/*  End Account  */}
              </div>
              {/*  End Footer  */}
            </div>
          </div>
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
                  <div
                    onClick={() => switchPage("dashboard")}
                    className={
                      "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary" +
                      (selectedPage === "dashboard" ? " bg-muted" : "")
                    }
                  >
                    <Home className="h-4 w-4" />
                    Dashboard
                  </div>
                  <div
                    onClick={() => switchPage("prompts")}
                    className={
                      "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary" +
                      (selectedPage === "prompts" ? " bg-muted" : "")
                    }
                  >
                    <SquarePen className="h-4 w-4" />
                    Prompts
                  </div>
                  <div
                    onClick={() => switchPage("settings")}
                    className={
                      "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary" +
                      (selectedPage === "settings" ? " bg-muted" : "")
                    }
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </div>
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
