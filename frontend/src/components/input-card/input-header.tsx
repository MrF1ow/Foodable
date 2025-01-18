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
  onClose,
}: InputHeaderProp & { onClose?: () => void }) => {
  return (
    <div className="p-4 relative flex items-center w-full overflow-hidden">
      <button
        onClick={onClose}
        className="absolute rounded-lg bg-card-background hover:bg-secondary transition focus:outline-none"
      >
        <Icons.close />
      </button>
      <div className="flex items-center justify-center w-full space-x-2">
        <p className="text-3xl text-center">{title}</p>
      </div>
    </div>
  );
};
