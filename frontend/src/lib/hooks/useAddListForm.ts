import { AddListFormSchema } from "@/lib/validation/forms/schemas/addListSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export const useAddListForm = ({ title }: { title: string }) => {
  const defaultValues = {
    title: title,
    category: "",
  };

  return {
    resolver: zodResolver(AddListFormSchema),
    defaultValues,
  };
};
