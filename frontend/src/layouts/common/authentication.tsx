import React from "react";
import Line from "@/components/ui/line";

export const AuthenticationLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-background relative">
        {/* Figure out how to get the title aligned */}
        {children}
        <Line className="bg-primary absolute bottom-0 left-0 w-full h-3" />
      </div>
    </>
  );
};
