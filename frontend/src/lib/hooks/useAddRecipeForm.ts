import { zodResolver } from "@hookform/resolvers/zod";
import { AddRecipeFormSchema } from "@/lib/validation/forms/schemas/addRecipeSchema";

export const useAddRecipeForm = () => {
  const defaultValues = {
    title: "",
    description: "",
    ingredients: [{ name: "", quantity: 1, unit: "", category: "" }],
    instructions: [{ step: "" }],
    image: undefined,
  };

  return {
    resolver: zodResolver(AddRecipeFormSchema),
    defaultValues,
  };
};
