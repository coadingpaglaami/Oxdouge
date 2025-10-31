import { Navbar, Sidebar } from "@/appcomponent/admin";
import { Inter } from "next/font/google";
import UserLayout from "../(main)/UserLayOut";

const myFont = Inter({ subsets: ["latin"] });

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        "flex min-h-screen bg-[#121212] text-white" + " " + myFont.className
      }
    >
      {/* Sidebar */}
      <div className="w-64 h-screen sticky top-0 border-r border-primary/20 max-md:hidden">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <div className="h-16 ">
          <Navbar />
        </div>

        {/* Scrollable Children */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
