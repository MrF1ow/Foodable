import { z } from "zod";

export const AddRecipeFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.instanceof(File).refine((file) => file.size > 0, {
    message: "Image is required",
  }),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1, "Ingredient name is required"),
        quantity: z.number().min(0, "Must be greater than 0"),
        unit: z.string().min(1, "Unit is required"),
        category: z.string().min(1, "Category is required"),
      })
    )
    .min(1, "At least one ingredient is required"),
  instructions: z
    .array(
      z.object({
        step: z.string().min(1, "Step cannot be empty"),
      })
    )
    .min(1, "At least one instruction step is required"),
});

export type AddRecipeFormValues = z.infer<typeof AddRecipeFormSchema>;
