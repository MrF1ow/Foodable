import { z } from "zod";


export const AddListFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is Required")
    .max(20, "Title must be less than 20 characters"),
  category: z.string().min(1, "Category is Required"),

});


export type AddListFormValues = z.infer<typeof AddListFormSchema>

