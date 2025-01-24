import { GeneralHeader, GeneralHeaderProps } from "./general-header";

export const HeaderWithButton = ({
  title,
  width,
  buttonText,
  handleButtonClick,
}: GeneralHeaderProps & { buttonText: string } & {
  handleButtonClick?: () => void;
}) => {
  return (
    <div className="h-full flex justify-between items-center">
      <GeneralHeader title={title} width={width} />
      <button
        onClick={handleButtonClick}
        className="text-2xl px-6 py-2 bg-primary font-bold rounded-md"
      >
        {buttonText}
      </button>
    </div>
  );
};
