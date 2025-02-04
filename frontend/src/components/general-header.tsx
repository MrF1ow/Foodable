export interface GeneralHeaderProps {
  title: string;
  width: string;
}

export const GeneralHeader = ({ title, width }: GeneralHeaderProps) => {
  return (
    <div
      className={`inline-flex items-center bg-primary font-bold rounded-[0%_0%_75%_0%] rounded-l-lg rounded-tr-lg px-4 py-2 h-full`}
      style={{ width: width }}
    >
      <span className="text-foreground text-4xl">{title}</span>
    </div>
  );
};
