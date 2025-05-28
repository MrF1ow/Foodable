import { z } from "zod";

export const EditCategoryFormSchema = z.object({
  name: z
    .string()
    .min(1, "Category is Required")
    .max(25, "Category title must be 25 characters or fewer.")
    .refine(
      (val) => val.trim().toLowerCase() !== "my items",
      "You cannot use 'My Items' as a category name."
    ),
});

export type EditCategoryFormValues = z.infer<typeof EditCategoryFormSchema>;
