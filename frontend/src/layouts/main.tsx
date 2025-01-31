import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { Navbar } from "@/components/navbar";
import { useGeneralStore } from "@/stores/general/store";

export const MainLayout = ({
  children,
  headerComponent,
}: {
  children: React.ReactNode;
  headerComponent: React.ReactNode;
}) => {
  const setIsMobile = useGeneralStore((state) => state.setIsMobile);
  const isMobile = useGeneralStore((state) => state.isMobile);
  const setCurrentPage = useGeneralStore((state) => state.setCurrentPage);

  const pathName = usePathname();

  const checkScreenWidth = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    checkScreenWidth(); // Initial check
    window.addEventListener("resize", checkScreenWidth); // Listen to screen resizes

    return () => {
      window.removeEventListener("resize", checkScreenWidth); // Cleanup on unmount
    };
  }, [setIsMobile]);

  useEffect(() => {
    // Update current page whenever the path changes
    const pageName = pathName || "/home";
    setCurrentPage(pageName);
  }, [pathName, setCurrentPage]);

  return (
    <div className="flex h-screen w-screen bg-background overflow-hidden">
      {/* Bottom Navbar */}
      {isMobile && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full h-[8%] sm:h-[14%] bg-background z-50 ">
          <Navbar />
        </div>
      )}

      {/* Sidebar */}
      {!isMobile && (
        <div className="w-[12%] lg:w-[8%] min-w-[100px] h-full bg-background p-6 flex-shrink-0">
          <Navbar />
        </div>
      )}

      {/* Main Content */}
      <div
        className={`grid grid-rows-[6%_94%] md:grid-rows-[8%_90%] lg:grid-rows-[10%_90%] gap-y-2 w-full h-full bg-background p-4 md:p-6`}
      >
        <div className="h-full">{headerComponent}</div>
        <div className="flex-1 h-full">{children}</div>
      </div>
    </div>
  );
};
