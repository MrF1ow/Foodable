import { z } from "zod";

export const EditCategoryFormSchema = z.object({
  name: z
    .string()
    .max(25, "Category title must be 25 characters or fewer.")
    .refine(
      (val) => val.trim().toLowerCase() !== "my recipes",
      "You cannot use 'My Recipes' as a category name.",
    ),
});

export type EditCategoryFormValues = z.infer<typeof EditCategoryFormSchema>;
