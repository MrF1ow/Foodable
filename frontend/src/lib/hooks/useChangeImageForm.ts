import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeImageFormSchema } from "@/lib/validation/forms/schemas/changeImageSchema";

export const useChangeImageForm = () => {
    const defaultValues = {
        image: null,
    };

    return {
        resolver: zodResolver(ChangeImageFormSchema),
        defaultValues,
    };
};
