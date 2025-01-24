import React, { useState, useEffect } from "react";

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

  const checkScreenWidth = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    checkScreenWidth(); // Initial check
    window.addEventListener("resize", checkScreenWidth); // Listen to screen resizes

    return () => {
      window.removeEventListener("resize", checkScreenWidth); // Cleanup on unmount
    };
  }, [setIsMobile]);

  return (
    <div className="flex h-screen w-screen bg-background">
      {/* Sidebar */}
      {isMobile && (
        <div className="w-full h-[8%] bg-background p-6">
          <Navbar />
        </div>
      )}

      {/* Sidebar */}
      {!isMobile && (
        <div className="w-[8%] h-full bg-background p-6">
          <Navbar />
        </div>
      )}

      {/* Main Content */}
      <div
        className={`grid grid-rows-[10%_90%] w-full h-full bg-background p-6`}
      >
        <div className="h-full">{headerComponent}</div>
        <div className="flex-1 h-full">{children}</div>
      </div>
    </div>
  );
};
