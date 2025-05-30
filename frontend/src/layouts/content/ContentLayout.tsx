"use client";

import { useGeneralStore } from "@/stores/general/store";
import React from "react";
import clsx from "clsx";


type ContentLayoutProps = {
  mainContent: React.ReactNode;
  split?: boolean;
};

export default function ContentLayout({
  split,
  mainContent,
}: ContentLayoutProps) {
  const isMobile = useGeneralStore((state) => state.isMobile);
  const isSplit = useGeneralStore((state) => state.splitLayout);
  const showPortal = useGeneralStore((state) => state.showPortal);

  const splitPage = split ? split : isSplit;

  return (
    <div className="w-full h-full bg-background overflow-x-hidden overflow-y-auto pb-[20%] md:pb-[15%] lg:pb-0">
      {isMobile ? (
        <>
          <div className="h-full overflow-y-auto overflow-x-hidden">{mainContent}</div>
          <div
            id="content-mobile-portal"
            className={clsx({
              "fixed inset-0 z-50 overflow-hidden": showPortal,
              hidden: !showPortal,
            })}
          />
        </>
      ) : splitPage ? (
        <div className="flex flex-row h-full bg-background">
          <div className="relative w-[65%] h-auto bg-background overflow-auto">
            {mainContent}
          </div>
          <div
            id="content-split-portal"
            className={clsx({
              "relative flex-1": splitPage,
              hidden: !splitPage,
            })}
          />
        </div>
      ) : (
        <div className="h-full overflow-auto">{mainContent}
        </div>
      )}
    </div>
  );
}
