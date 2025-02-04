import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { InputHeaderProp } from "@/types/input";
import { Icons } from "../ui/icons";

export const InputHeader = ({
  title,
  onClick,
}: InputHeaderProp & { onClick?: () => void }) => {
  return (
    <div className="p-4 relative flex items-center w-full overflow-hidden">
      <button
        onClick={onClick}
        className="absolute rounded-lg bg-card-background hover:bg-secondary transition focus:outline-none hover:scale-105"
      >
        <Icons.close />
      </button>
      <div className="flex items-center justify-center w-full space-x-2">
        <p className="p-1 text-3xl text-center">{title}</p>
      </div>
    </div>
  );
};
