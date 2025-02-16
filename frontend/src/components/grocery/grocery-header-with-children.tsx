import { GroceryHeader, GroceryHeaderProps } from "./grocery-header";
import { useGeneralStore } from "@/stores/general/store";

export const GroceryHeaderWithChildren = ({
  title,
  width,
  children,
  editButton,
}: GroceryHeaderProps & {
  children: React.ReactNode;
  editButton?: React.ReactNode;
}) => {
  const isMobile = useGeneralStore((state) => state.isMobile);
  return (
    <div
      className={`h-full flex ${
        isMobile ? "justify-center" : "justify-between"
      } items-center`}
    >
      {!isMobile && (
        <GroceryHeader title={title} width={width} editButton={editButton} />
      )}
      <div>{children}</div>
    </div>
  );
};
