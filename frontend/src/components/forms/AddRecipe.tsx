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
import { date, z } from "zod";
import { useGeneralStore } from "@/stores/general/store";
import { getAddRecipeFormValidation } from "@/lib/utils/formValidation";
import { useCreateRecipe } from "@/server/hooks/recipeHooks";
import { NewRecipe, Recipe } from "@/types/recipe";
// import { SavedItem } from "@/types/savedItems";
import { GrocerySectionOptions } from "@/types/grocery";
import { showToast } from "@/app/providers";
import { TOAST_SEVERITY } from "@/lib/constants/ui";
import { useCreateSavedItem } from "@/server/hooks/savedItemsHooks";
import { useState } from "react";
import { useFetchSelf } from "@/server/hooks/userHooks";
import { NewImageData } from "@/types/images";
import { useUploadImage } from "@/server/hooks/imageHooks";
import { randomUUID } from "crypto";

export const AddRecipe = () => {
  const isMobile = useGeneralStore((state) => state.isMobile);
  const categories = grocerySections;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const setCurrentForm = useGeneralStore((state) => state.setCurrentForm);
  const setShowPortal = useGeneralStore((state) => state.setShowPortal);

  const { AddRecipeFormSchema, defaultValues, resolver } =
    getAddRecipeFormValidation();

  const { createRecipe } = useCreateRecipe();
  const { createSavedItem } = useCreateSavedItem();
  const { userProfile } = useFetchSelf({ enabled: true });
  const { uploadImage } = useUploadImage();

  const form = useForm<z.infer<typeof AddRecipeFormSchema>>({
    defaultValues,
    resolver,
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({
    control: form.control,
    name: "instructions",
  });

  const onSubmit = async (data: z.infer<typeof AddRecipeFormSchema>) => {
    const newRecipe = {
      title: data.title,
      description: data.description,
      ingredients: data.ingredients.map((ingredient) => ({
        ...ingredient,
        category: categories.find(
          (section) => section.title === ingredient.category
        )?.title as GrocerySectionOptions,
      })),
      instructions: data.instructions.map((instruction) => instruction.step),
      image: data.image,
      creatorId: userProfile._id,
      imageId: null,
      userRatings: [],
      averageRating: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priceApproximation: 0,
      timeApproximation: 0,
      timestamp: new Date(),
      tags: [],
    };

    const createData = await createRecipe(newRecipe as Recipe);

    const newImage: NewImageData = {
      image: data.image as File,
      sourceId: createData._id,
      collectionName: "recipes",
    };

    const image = await uploadImage(newImage);

    if (!createData) {
      showToast(
        TOAST_SEVERITY.ERROR,
        "Error",
        "Failed to create grocery list",
        3000
      );
      return;
    }

    const newSaveItem = {
      _id: createData._id,
      imageId: image._id,
      tags: [],
      title: createData.title,
      type: "recipe",
      category: "Recipes",
    };

    const savedItem = await createSavedItem(newSaveItem as SavedItem);
  };

  const handleInputClose = () => {
    setCurrentForm(null);
    setShowPortal(false);
  };

  return (
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
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-2xl">Recipe Picture</FormLabel>
                  <FormControl>
                    <label className="w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-primary transition text-lg">
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          field.onChange(file);

                          if (file) {
                            const url = URL.createObjectURL(file);
                            setPreviewUrl(url);
                          } else {
                            setPreviewUrl(null);
                          }
                        }}
                        data-testid="recipe-image-input"
                      />
                      {previewUrl ? (
                        <div className="flex flex-col items-center gap-2">
                          <div>{field.value?.name}</div>
                          <img
                            src={previewUrl}
                            alt="Recipe Preview"
                            className="max-h-48 rounded-md"
                          />
                        </div>
                      ) : (
                        field.value?.name || "Click to upload image"
                      )}
                    </label>
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
              {ingredientFields.map((field, index) => (
                <div
                  key={field.id}
                  className="relative border p-3 pr-12 rounded flex flex-col gap-2"
                >
                  <div
                    className={`flex ${
                      isMobile ? "flex-col" : "flex-row"
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
                  {ingredientFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      data-testid={`remove-ingredient-${index}`}
                      aria-label="Remove ingredient"
                    >
                      <Icons.delete />
                    </button>
                  )}
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
                    appendIngredient({
                      name: "",
                      quantity: 1,
                      unit: "",
                      category: "",
                    })
                  }
                >
                  <Icons.plus />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <FormLabel className="text-2xl">Instructions</FormLabel>
              {instructionFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name={`instructions.${index}.step`}
                    render={({ field: instructionField }) => (
                      <FormItem className="flex flex-row items-center gap-4 flex-1">
                        <FormLabel className="text-lg">
                          Step {index + 1}
                        </FormLabel>
                        <FormControl className="flex-1">
                          <Input
                            {...form.register(`instructions.${index}.step`)}
                            placeholder={`Explain step ${index + 1}...`}
                            className="!text-lg h-10"
                            data-testid={`instruction-${index}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {instructionFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInstruction(index)}
                      data-testid={`remove-instruction-${index}`}
                    >
                      <Icons.delete />
                    </button>
                  )}
                </div>
              ))}

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => appendInstruction({ step: "" })}
                  className="btn-primary p-2 mt-2 text-lg"
                >
                  <Icons.plus />
                </button>
              </div>
            </div>
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
  );
};
