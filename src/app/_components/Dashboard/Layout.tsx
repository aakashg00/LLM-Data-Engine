import Navbar from "./Navbar";
import type { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <div className="bg-gray-50">
    {/* <Navbar /> */}
    <Sidebar />

    <div>{children}</div>
  </div>
);

export default Layout;
