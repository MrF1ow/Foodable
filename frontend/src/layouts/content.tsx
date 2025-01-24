import React, { useState } from "react";

import { useGeneralStore } from "@/stores/general/store";

// Enforces the type of the props passed to the component
type ContentLayoutProps =
  | {
      split: true;
      leftSide: React.ReactNode;
      rightSide: React.ReactNode;
      all?: never;
    }
  | {
      split?: false;
      leftSide?: never;
      rightSide?: never;
      all: React.ReactNode;
    };

export const ContentLayout = ({
  split,
  leftSide,
  rightSide,
  all,
}: ContentLayoutProps) => {
  const isMobile = useGeneralStore((state) => state.isMobile);

  return (
    <div className="w-full h-full bg-background overflow-hidden pt-6">
      {isMobile ? (
        <div>{all}</div>
      ) : split ? (
        <div className="flex flex-row h-full bg-background">
          <div className="relative w-[60%] h-auto bg-background">
            {leftSide}
          </div>
          <div className="w-[40%] px-24">{rightSide}</div>
        </div>
      ) : (
        <div>{all}</div>
      )}
    </div>
  );
};
