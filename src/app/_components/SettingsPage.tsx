import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

function SettingsPage() {
  return (
    <main id="content" role="main" className="md:ps-[260px]">
      <div className="flex min-h-screen flex-col space-y-5 p-5">
        {/* Page Header  */}
        <div className="flex h-10 items-center justify-between gap-x-5">
          <h2 className="inline-block text-lg font-semibold text-gray-800 dark:text-neutral-200">
            Settings
          </h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle></CardTitle>
          </CardHeader>

          {/* <CardFooter className="flex justify-end"></CardFooter> */}
        </Card>
      </div>
    </main>
  );
}

export default SettingsPage;
