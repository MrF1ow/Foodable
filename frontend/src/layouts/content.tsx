import React, { useState } from "react";

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
  return (
    <div className="w-full h-full bg-background overflow-hidden pt-6">
      {split ? (
        <div className="flex flex-row h-full bg-background">
          <div className="w-[67%] h-auto bg-background">{leftSide}</div>
          <div className="flex-1">{rightSide}</div>
        </div>
      ) : (
        <div>{all}</div>
      )}
    </div>
  );
};
