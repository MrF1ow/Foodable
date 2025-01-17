import { InputSection } from "@/types/input";
import { Icons } from "../ui/icons";

export const InputHeader = ({
  title,
  onClose,
}: InputSection & { onClose?: () => void }) => {
  return (
    <div className="flex items-center w-full space-x-2">
      <button
        onClick={onClose}
        className="p-2 rounded-lg bg-card-background hover:bg-secondary transition  focus:outline-none"
      >
        <Icons.close />
      </button>
      <p className="text-xl font-bold">{title}</p>
    </div>
  );
};
