import { zodResolver } from "@hookform/resolvers/zod";
import { EditCategoryFormSchema } from "@/lib/validation/forms/schemas";

export const useEditCategoryForm = (initialName = "") => {
  const defaultValues = {
    name: initialName,
  };

  return {
    resolver: zodResolver(EditCategoryFormSchema),
    defaultValues,
  };
};

