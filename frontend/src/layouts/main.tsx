import React from "react";

import { Navbar } from "@/components/navbar";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-background relative">
      <div className="absolute top-0 left-0 w-[8%] h-full bg-background">
        <Navbar />
      </div>
      <div className="absolute top-0 right-0 w-[92%] h-full bg-background">
        {children}
      </div>
    </div>
  );
};
