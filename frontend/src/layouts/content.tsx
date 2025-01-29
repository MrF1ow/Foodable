import React from "react";

import { useGeneralStore } from "@/stores/general/store";

// Enforces the type of the props passed to the component
type ContentLayoutProps =
  | {
      split: true;
      mainContent: React.ReactNode;
      subContent: React.ReactNode;
    }
  | {
      split?: false;
      mainContent: React.ReactNode;
      subContent?: never;
    };

export const ContentLayout = ({
  split,
  mainContent,
  subContent,
}: ContentLayoutProps) => {
  const isMobile = useGeneralStore((state) => state.isMobile);

  return (
    <div className="w-full h-full bg-background overflow-hidden pt-6">
      {isMobile ? (
        <div className="h-full overflow-auto pb-[8%]">{mainContent}</div>
      ) : split ? (
        <div className="flex flex-row h-full bg-background">
          <div className="relative w-[67%] h-auto bg-background overflow-auto">
            {mainContent}
          </div>
          <div className="flex-1">{subContent}</div>
        </div>
      ) : (
        <div className="overflow-auto">{mainContent}</div>
      )}
    </div>
  );
};
