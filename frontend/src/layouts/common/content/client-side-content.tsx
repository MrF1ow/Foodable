"use client";

import { useGeneralStore } from "@/stores/general/store";

type ContentLayoutProps =
  | {
      split: true;
      mainContent: React.ReactNode;
      subContent: React.ReactNode;
    }
  | {
      split?: false;
      mainContent: React.ReactNode;
      subContent?: React.ReactNode;
    };

export function ClientSideContentLayout({
  split,
  mainContent,
  subContent,
}: ContentLayoutProps) {
  const isMobile = useGeneralStore((state) => state.isMobile);
  const isSplit = useGeneralStore((state) => state.splitLayout);

  const splitPage = split ? split : isSplit;

  return (
    <div className="w-full h-full bg-background overflow-hidden">
      {isMobile ? (
        <div className="h-full overflow-auto pb-[8%]">{mainContent}</div>
      ) : splitPage ? (
        <div className="flex flex-row h-full bg-background">
          <div className="relative w-[67%] h-auto bg-background overflow-auto">
            {mainContent}
          </div>
          <div className="relative flex-1">{subContent}</div>
        </div>
      ) : (
        <div className="h-full overflow-auto">{mainContent}</div>
      )}
    </div>
  );
}
