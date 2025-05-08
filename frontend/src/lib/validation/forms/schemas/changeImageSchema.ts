import { z } from "zod";

export const ChangeImageFormSchema = z.object({
  image: z
    .union([z.instanceof(File), z.null()])
    .refine((file) => file === null || file.size > 0, {
      message: "Image is required",
    }),
});

export type ChangeImageFormValues = z.infer<typeof ChangeImageFormSchema>;
