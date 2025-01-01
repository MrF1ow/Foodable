import React from "react";

export const ContentLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full h-full bg-background p-6">{children}</div>;
};
