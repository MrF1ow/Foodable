"use client";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import {
    FormField,
    FormItem,
    FormControl,
    FormLabel,
    FormMessage,
    Form,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import InputCard from "@/components/InputCard";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { unitOptions } from "@/config/unit-conversions";
import { useFieldArray } from "react-hook-form";
import { grocerySections } from "@/config/grocery-sections";

import { useGeneralStore } from "@/stores/general/store";

export const AddRecipe = ({ className }: { className?: string }) => {
    const isMobile = useGeneralStore((state) => state.isMobile);
    const categories = grocerySections;

    const setCurrentForm = useGeneralStore(
        (state) => state.setCurrentForm
    );
    const setShowPortal = useGeneralStore(
        (state) => state.setShowPortal
    );

    type RecipeFormValues = {
        title: string;
        description: string;
        ingredients: {
            name: string;
            quantity: number;
            unit: string;
            category: string;
        }[];
        instructions: string;
    };

    const form = useForm<RecipeFormValues>({
        defaultValues: {
            title: "",
            description: "",
            ingredients: [{ name: "", quantity: 1, unit: "", category: "" }],
            instructions: "",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "ingredients",
    });

    const onSubmit = (data: RecipeFormValues) => {
        console.log("Form submitted:", data);
    };

    const handleInputClose = () => {
        setCurrentForm(null);
        setShowPortal(false);
    };

    return (
        <div className={cn(className)}>
            <Form {...form}>
                <InputCard
                    title="Add Recipe"
                    onClick={handleInputClose}
                    content={
                        <div className="flex flex-col gap-6 h-full w-full overflow-y-auto">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-2xl">Recipe Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="!text-xl h-12"
                                                placeholder="Enter recipe title"
                                                {...field}
                                                data-testid="recipe-title-input"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-2xl">Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="!text-xl h-24"
                                                placeholder="Enter recipe description"
                                                {...field}
                                                data-testid="recipe-description-input"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex flex-col gap-4">
                                <FormLabel className="text-2xl">Ingredients</FormLabel>
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="relative border p-3 pr-12 rounded flex flex-col gap-2"
                                    >
                                        <div
                                            className={`flex ${isMobile ? "flex-col" : "flex-row"
                                                } gap-4`}
                                        >
                                            <FormField
                                                control={form.control}
                                                name={`ingredients.${index}.name`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xl">Name</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                className="!text-lg h-[2.875rem]"
                                                                placeholder="Name"
                                                                {...field}
                                                                data-testid={`ingredient-${index}-name`}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`ingredients.${index}.category`}
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel className="text-xl">
                                                            Select Category
                                                        </FormLabel>
                                                        <div className="border rounded shadow-sm w-40 py-2">
                                                            <FormControl>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger
                                                                        className="text-lg w-40 hover:scale-105"
                                                                        data-testid="category-dropdown"
                                                                    >
                                                                        {field.value || "Select Category"}
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent className="max-h-60 m-3 overflow-y-auto">
                                                                        {categories.map((section) => (
                                                                            <DropdownMenuItem
                                                                                key={section.title}
                                                                                onClick={() => {
                                                                                    field.onChange(section.title);
                                                                                }}
                                                                                data-testid={`${section.title}-category-recipe-form`}
                                                                            >
                                                                                {section.title}
                                                                            </DropdownMenuItem>
                                                                        ))}
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </FormControl>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2"
                                            data-testid={`remove-ingredient-${index}`}
                                            aria-label="Remove ingredient"
                                        >
                                            <Icons.delete />
                                        </button>
                                        <div className="flex flex-row gap-4">
                                            <FormField
                                                control={form.control}
                                                name={`ingredients.${index}.quantity`}
                                                render={({ field }) => (
                                                    <FormItem className="w-24">
                                                        <FormLabel className="text-xl">Qty</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="text"
                                                                className="!text-lg h-[2.875rem] w-full"
                                                                placeholder="0"
                                                                {...field}
                                                                data-testid={`ingredient-${index}-quantity`}
                                                                onChange={(e) => {
                                                                    const value = e.target.value.replace(
                                                                        /^0+(?!$)/,
                                                                        ""
                                                                    ); // Remove leading zeros
                                                                    if (value === "" || /^\d+$/.test(value)) {
                                                                        // Allow empty or numeric input
                                                                        field.onChange(
                                                                            value === "" ? "" : Number(value)
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`ingredients.${index}.unit`}
                                                render={({ field }) => (
                                                    <FormItem className="w-24">
                                                        <FormLabel className="text-xl">Unit</FormLabel>
                                                        <div className="border rounded shadow-sm py-2">
                                                            <FormControl>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger className="text-lg w-full hover:scale-105">
                                                                        {field.value || "Select"}
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent className="max-h-60 overflow-y-auto">
                                                                        {unitOptions.map((unit) => (
                                                                            <DropdownMenuItem
                                                                                key={unit}
                                                                                onClick={() => field.onChange(unit)}
                                                                            >
                                                                                {unit}
                                                                            </DropdownMenuItem>
                                                                        ))}
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </FormControl>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div className="flex justify-center">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            append({ name: "", quantity: 1, unit: "", category: "" })
                                        }
                                    >
                                        <Icons.plus />
                                    </button>
                                </div>
                            </div>
                            <FormField
                                control={form.control}
                                name="instructions"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-2xl">Instructions</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="!text-xl h-40"
                                                placeholder="Enter instructions, separated by new lines"
                                                {...field}
                                                data-testid="instructions-input"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    }
                    footer={
                        <div className="flex justify-center ">
                            <Button
                                type="submit"
                                onClick={form.handleSubmit(onSubmit)}
                                className="btn-primary p-8 text-3xl transition-all hover:scale-105 hover:shadow-lg"
                                data-testid="submit-button"
                            >
                                Submit
                            </Button>
                        </div>
                    }
                />
            </Form>
        </div>
    );
};
