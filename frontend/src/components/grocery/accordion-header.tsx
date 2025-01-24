import { GrocerySection } from "@/types/grocery";
import { Icons } from "../ui/icons";

export const AccordionHeader = ({ title, Icon, color }: GrocerySection) => {
  return (
    <div className="flex items-center w-full space-x-2">
      <Icon className="w-10 h-10" fill={color} />
      <p className="text-xl font-bold" style={{ color: color }}>
        {title}
      </p>
      <button
        style={{
          color: "white",
          backgroundColor: color,
          borderRadius: "50%",
        }}
      >
        <Icons.plus />
      </button>
    </div>
  );
};
