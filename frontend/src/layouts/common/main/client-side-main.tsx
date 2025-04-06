"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useGeneralStore } from "@/stores/general/store";
import { Navbar } from "@/components/common/navbar";
import { useTheme } from "next-themes";
import { clerkThemeVariables } from "@/config/clerk-theme-variables";

export default function ClientSideMainLayout({
  children,
  headerComponent,
}: {
  children: React.ReactNode;
  headerComponent?: React.ReactNode;
}) {
  const setIsMobile = useGeneralStore((state) => state.setIsMobile);
  const isMobile = useGeneralStore((state) => state.isMobile);
  const setClerkVariables = useGeneralStore((state) => state.setClerkVariables);
  const setCurrentPage = useGeneralStore((state) => state.setCurrentPage);

  const { theme } = useTheme();

  const pathName = usePathname();

  useEffect(() => {
    setCurrentPage(pathName || "/home");
  }, [pathName, setCurrentPage]);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);
    return () => window.removeEventListener("resize", checkScreenWidth);
  }, [setIsMobile]);

  useEffect(() => {
    if (theme === "dark") {
      setClerkVariables(clerkThemeVariables.dark);
    } else {
      setClerkVariables(clerkThemeVariables.light);
    }
  }, [theme]);

  return (
    <>
      {isMobile && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full h-[8%] sm:h-[14%] bg-background z-50">
          <Navbar />
        </div>
      )}
      {!isMobile && (
        <div className="w-[12%] lg:w-[8%] min-w-[100px] h-full bg-background p-6 flex-shrink-0">
          <Navbar />
        </div>
      )}
      {headerComponent ? (
        <div className="grid grid-rows-[6%_94%] md:grid-rows-[8%_90%] lg:grid-rows-[10%_90%] w-full h-full bg-background p-6 gap-y-2">
          <div className="h-full">{headerComponent}</div>
          <div className="flex-1 h-full">{children}</div>
        </div>
      ) : (
        <div className={`overflow-y-auto w-full h-full bg-background p-6`}>{children}</div>
      )}
    </>
  );
}
