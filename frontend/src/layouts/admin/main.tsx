import React from "react";

import { Navbar } from "@/components/admin/navbar";

export const MainLayout = ({
  children,
  headerComponent,
}: {
  children: React.ReactNode;
  headerComponent?: React.ReactNode;
}) => {
  return (
    <div className="flex h-screen w-screen bg-background overflow-hidden">
      <div className="w-[12%] lg:w-[8%] min-w-[100px] h-full bg-background p-6 flex-shrink-0">
        <Navbar />
      </div>

      {/* Main Content */}
      {headerComponent ? (
        <div
          className={`grid grid-rows-[6%_94%] md:grid-rows-[8%_90%] lg:grid-rows-[10%_90%] w-full h-full bg-background p-6 gap-y-2`}
        >
          <div className="h-full">{headerComponent}</div>
          <div className="flex-1 h-full">{children}</div>
        </div>
      ) : (
        <div className={`w-full h-full bg-background p-6`}>{children}</div>
      )}
    </div>
  );
};
