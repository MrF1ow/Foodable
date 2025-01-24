import { GeneralHeader, GeneralHeaderProps } from "./general-header";

export const HeaderWithButton = ({
  title,
  width,
  buttonText,
}: GeneralHeaderProps & { buttonText: string }) => {
  const handleButtonClick = () => {
    console.log("Header Button Clicked");
  };
  return (
    <div className=" h-full">
      <GeneralHeader title={title} width={width} />
      <button
        onClick={handleButtonClick}
        className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        {buttonText}
      </button>
    </div>
  );
};
