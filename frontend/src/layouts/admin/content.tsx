import React from "react";

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
      subContent?: React.ReactNode;
    };

export const ContentLayout = ({
  split,
  mainContent,
  subContent,
}: ContentLayoutProps) => {
  return (
    <div className="w-full h-full bg-background overflow-hidden">
      {split ? (
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
};
