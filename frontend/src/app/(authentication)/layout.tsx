import React from "react";
import Line from "@/components/ui/line";

export default async function AuthenticationLayout(
  {
    children,
  }: {
    children: React.ReactNode;
  }
) {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-background relative">
        {/* Figure out how to get the title aligned */}
        <div className="flex flex-col w-full justify-center items-center px-4 sm:justify-center">
          <h1 className="text-primary text-4xl font-bold mb-6">Foodable</h1>
          {children}
        </div>
        <Line className="bg-primary absolute bottom-0 left-0 w-full h-3" />
      </div>
    </>
  );
};
