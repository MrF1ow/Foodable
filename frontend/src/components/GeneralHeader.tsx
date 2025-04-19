import { JSX } from "react";

export interface GeneralHeaderProps {
  title: string;
  width?: string;
}

export default function GeneralHeader({ title, width }: GeneralHeaderProps): JSX.Element {
  return (
    <div
      className={`inline-flex items-center justify-center md:justify-start bg-primary font-bold md:rounded-[0%_0%_75%_0%] md:rounded-l-lg md:rounded-tr-lg rounded-lg px-4 py-2 h-full w-full lg:w-[25%]`}
      style={{ width: width }}
    >
      <span className="text-foreground text-4xl">{title}</span>
    </div>
  );
};
