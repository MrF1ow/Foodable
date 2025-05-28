import { zodResolver } from "@hookform/resolvers/zod";
import { EditCategorySchema } from "@/lib/validation/forms/schemas";

export const useEditCategoryForm = (initialName = "") => {
  const defaultValues = {
    name: initialName,
  };

  return {
    resolver: zodResolver(EditCategorySchema),
    defaultValues,
  };
};

