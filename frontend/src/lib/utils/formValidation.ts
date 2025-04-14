import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GrocerySectionOptions } from "@/types/grocery";
import { unitsAsTuple } from "@/config/unit-conversions";
import { useGroceryStore } from "@/stores/grocery/store";

export const AddItemFormSchema = z.object({
  itemName: z
    .string()
    .min(3, "Item name must be at least 3 characters long")
    .max(50, "Item name must be less than 50 characters long"),
  quantity: z
    .number()
    .min(1, "Quantity must be at least 1")
    .max(100, "Quantity must be less than 100"),
  category: z.string().min(1, "Category is required"),
  unit: z.enum(unitsAsTuple),
});

export const getAddItemFormValidation = () => {
  const selectedCategory = useGroceryStore(
    (state) => state.selectedCategory as GrocerySectionOptions
  );

  const defaultValues = {
    itemName: "",
    quantity: 1,
    unit: unitsAsTuple[0],
    category: selectedCategory || "",
  };

  return {
    AddItemFormSchema,
    defaultValues,
    resolver: zodResolver(AddItemFormSchema),
  };
};

export const AddRecipeFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z
    .union([z.instanceof(File), z.null()])
    .refine((file) => file === null || file.size > 0, {
      message: "Image is required",
    }),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1, "Ingredient name is required"),
        quantity: z.number(),
        unit: z.string(),
        category: z.string(),
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

export const getAddRecipeFormValidation = () => {
  const defaultValues = {
    title: "",
    description: "",
    ingredients: [{ name: "", quantity: 1, unit: "", category: "" }],
    instructions: [{ step: "" }],
    image: null,
  };

  return {
    AddRecipeFormSchema,
    defaultValues,
    resolver: zodResolver(AddRecipeFormSchema),
  };
};
