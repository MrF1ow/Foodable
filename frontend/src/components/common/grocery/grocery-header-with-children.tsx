"use client";

import { GroceryHeader, GroceryHeaderProps } from "./grocery-header";
import { useGeneralStore } from "@/stores/general/store";

export const GroceryHeaderWithChildren = ({
  width,
  children,
}: GroceryHeaderProps & {
  children: React.ReactNode;
}) => {
  const isMobile = useGeneralStore((state) => state.isMobile);
  return (
    <div className="h-full flex justify-between items-center">
      <GroceryHeader width={width} />
      <div>{children}</div>
    </div>
  );
};
