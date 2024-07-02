import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader } from "lucide-react";

const pageAccessHOC = <P extends object>(Component: React.FC<P>) => {
  const WrappedComponent = (props: P) => {
    const router = useRouter();
    const pathname = usePathname();
    const { status, data } = useSession();

    useEffect(() => {
      if (status !== "loading" && status !== "authenticated") {
        const callbackUrl = encodeURIComponent(pathname);
        void router.replace(`/api/auth/signin?callbackUrl=${callbackUrl}`);
      }
    }, [status, router]);

    if (status === "loading") {
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center">
          <Loader className="h-12 w-12 animate-spin text-blue-600" />
          <span className="sr-only">Loading...</span>
        </div>
      );
    }
    if (status === "authenticated") {
      return <Component {...props} />;
    }
  };

  return WrappedComponent;
};

export default pageAccessHOC;
