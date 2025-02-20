import { GeneralHeader, GeneralHeaderProps } from "./general-header";
import { useGeneralStore } from "@/stores/general/store";

export const HeaderWithChildren = ({
  title,
  width,
  children,
}: GeneralHeaderProps & {
  children: React.ReactNode;
}) => {
  const isMobile = useGeneralStore((state) => state.isMobile);
  return (
    <div
      className={`h-full flex ${
        isMobile ? "justify-center" : "justify-between"
      } items-center`}
    >
      {!isMobile && <GeneralHeader title={title} width={width} />}
      <div>{children}</div>
    </div>
  );
};
