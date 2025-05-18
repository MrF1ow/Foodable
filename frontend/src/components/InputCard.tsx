import { Card, CardContent } from "@/components/ui/card";
import React, { JSX } from "react";
import {
  InputHeaderProp,
  InputContentProp,
  InputFooterProp,
} from "@/types/input";
import { useGeneralStore } from "@/stores/general/store";
import { Icons } from "@/components/ui/icons";

interface InputSectionProps
  extends InputHeaderProp,
    InputContentProp,
    InputFooterProp {}

export default function InputCard({
  title,
  onClick,
  content,
  footer,
}: InputSectionProps): JSX.Element {
  const isMobile = useGeneralStore((state) => state.isMobile);
  return (
    <Card
      className={`${
        isMobile ? "items-center h-[91%]" : "h-full"
      } w-full flex flex-col bg-card-background`}
    >
      <InputHeader title={title} onClick={onClick} />
      <CardContent className="flex-grow w-full overflow-y-auto">{content}</CardContent>
      <InputFooter>{footer}</InputFooter>
    </Card>
  );
}

const InputFooter = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full p-6">{children}</div>;
};

const InputHeader = ({
  title,
  onClick,
}: InputHeaderProp & { onClick?: () => void }) => {
  return (
    <div className="p-4 flex-shrink-0 relative flex items-center w-full overflow-hidden">
      <button
        onClick={onClick}
        className="absolute rounded-lg bg-card-background hover:bg-secondary transition focus:outline-none hover:scale-105"
        data-testid="close-form-button"
      >
        <Icons.close />
      </button>
      <div className="flex items-center justify-center w-full space-x-2">
        <p className="p-1 text-3xl text-center">{title}</p>
      </div>
    </div>
  );
};
