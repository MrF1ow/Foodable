import React from "react";

import { Navbar } from "@/components/navbar";

export const MainLayout = ({
  children,
  headerComponent,
}: {
  children: React.ReactNode;
  headerComponent: React.ReactNode;
}) => {
  return (
    <div className="flex h-screen w-screen bg-background">
      {/* Sidebar */}
      <div className="w-[8%] h-full bg-background p-6">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="grid grid-rows-[5%_95%] h-full w-full bg-background p-6">
        <div>{headerComponent}</div>
        <div className="flex-1 h-full">{children}</div>
      </div>
    </div>
  );
};
