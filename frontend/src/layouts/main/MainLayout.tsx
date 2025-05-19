"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useGeneralStore } from "@/stores/general/store";
import Navbar from "@/components/Navbar";
import { useTheme } from "next-themes";
import { clerkThemeVariables } from "@/config/clerk-theme-variables";
import clsx from "clsx";

export default function MainLayout({
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
  const showMainPortal = useGeneralStore((state) => state.showMainPortal);

  const { theme } = useTheme();

  const pathName = usePathname();

  useEffect(() => {
    setCurrentPage(pathName || "/home");
  }, [pathName, setCurrentPage]);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 900);
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
      <div
        id="main-modal-portal"
        className={clsx({
          "fixed inset-0 z-[50] flex items-center justify-center bg-background/5 backdrop-blur-sm transition-all w-full h-full":
            showMainPortal,
          hidden: !showMainPortal,
        })}
      />
      {isMobile && <Navbar />}
      {!isMobile && (
        <div className="w-[12%] lg:w-[8%] min-w-[100px] h-full p-6 flex-shrink-0">
          <Navbar />
        </div>
      )}
      {headerComponent ? (
        <div className="grid grid-rows-[10%_90%] w-full h-full p-2 md:p-4 lg:p-6 gap-y-2">
          <div className="h-full w-full">{headerComponent}</div>
          <div className="flex-1 h-full w-full">{children}</div>
        </div>
      ) : (
        <div
          className={clsx(
            "overflow-y-auto w-full h-full p-6",
            isMobile && "pb-24" // Add bottom padding to avoid overlap
          )}
        >
          {children}
        </div>
      )}
    </>
  );
}
