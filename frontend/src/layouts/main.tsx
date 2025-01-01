import React from "react";

import { Navbar } from "@/components/navbar";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-screen bg-background">
      {/* Sidebar */}
      <div className="w-[8%] h-full bg-background p-6">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="w-[92%] h-full bg-background p-6">
        {children}
      </div>
    </div>
  );
};
