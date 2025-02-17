import { GroceryHeader, GroceryHeaderProps } from "./grocery-header";
import { useGeneralStore } from "@/stores/general/store";
import { GroceryMetaData, UnsavedGroceryMetaData } from "@/types/saved";


export const GroceryHeaderWithChildren = ({
  width,
  metadata,
  children,
}: GroceryHeaderProps & {
  children: React.ReactNode;
}) => {
  const isMobile = useGeneralStore((state) => state.isMobile);
  return (
    <div
      className={`h-full flex ${
        isMobile ? "justify-center" : "justify-between"
      } items-center`}
    >
      {!isMobile && <GroceryHeader metadata={metadata} width={width} />}
      <div>{children}</div>
    </div>
  );
};
