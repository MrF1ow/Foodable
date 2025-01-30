import { GeneralHeader, GeneralHeaderProps } from "./general-header";

export const HeaderWithButton = ({
  title,
  width,
  children,
}: GeneralHeaderProps & { children: React.ReactNode }) => {
  return (
    <div className="h-full flex justify-between items-center">
      <GeneralHeader title={title} width={width} />
      <div>{children}</div>
    </div>
  );
};
