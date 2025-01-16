import { GrocerySection } from "@/types/grocery";

export const AccordionHeader = ({ title, Icon, color }: GrocerySection) => {
  return (
    <div className="flex items-center w-full space-x-6">
      <Icon className="w-16 h-16" fill={color} />
      <p className="text-xl font-bold" style={{ color: color }}>
        {title}
      </p>
    </div>
  );
};
