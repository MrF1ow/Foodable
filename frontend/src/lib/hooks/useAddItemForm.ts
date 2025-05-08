// lib/hooks/useAddItemForm.ts
import { useGroceryStore } from "@/stores/grocery/store";
import { AddItemFormSchema } from "@/lib/validation/forms/schemas/addItemSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { unitsAsTuple } from "@/config/unit-conversions";

export const useAddItemForm = () => {
    const selectedCategory = useGroceryStore((state) => state.selectedCategory);

    const defaultValues = {
        itemName: "",
        quantity: 1,
        unit: unitsAsTuple[0],
        category: selectedCategory || "",
    };

    return {
        resolver: zodResolver(AddItemFormSchema),
        defaultValues,
    };
};
