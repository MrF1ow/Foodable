import React from "react";
import { Recipe } from "@/types/recipe";
import { RecipeSection } from "./recipe-section";
import { Checkbox } from "@/components/ui/checkbox";
import { GroceryList, GrocerySectionOptions } from "@/types/grocery";
import { useGroceryStore } from "@/stores/grocery/store";
import { useRecipeStore } from "@/stores/recipe/store";
import { GroceryItem } from "@/types/grocery";
import {
  useUpdateGroceryList,
  useAllGroceryLists,
} from "@/server/hooks/groceryListHooks";
import { Icons } from "@/components/ui/icons";
import { insertItemIntoGroceryMap } from "@/utils/listItems";

export const RecipeContent = ({ recipe }: { recipe: Recipe }) => {
  const groceryMap = useGroceryStore((state) => state.map);
  const setMap = useGroceryStore((state) => state.setMap);
  const currentList = useGroceryStore((state) => state.currentList);

  const { refetchGroceryLists } = useAllGroceryLists({
    metadata: true,
    enabled: true,
  });
  const { updateGroceryList } = useUpdateGroceryList();

  const additionalIngredients = useRecipeStore(
    (state) => state.additionalIngredients
  );
  const setAdditionalIngredients = useRecipeStore(
    (state) => state.setAdditionalIngredients
  );

  const addIngredient = async (ingredient: GroceryItem) => {
    const newMap = insertItemIntoGroceryMap(ingredient, groceryMap);
    setMap(newMap);

    const updatedItems = Array.from(newMap.values());

    const newList = {
      ...currentList,
      items: updatedItems,
    };

    if (currentList?._id) {
      await updateGroceryList(newList as GroceryList);
    }

    await refetchGroceryLists();
  };

  const AddButtonForAdditional = () => {
    const handleIngredientTransfer = () => {
      const updatedItems = [];
      for (const ingredient of additionalIngredients) {
        if (ingredient.checked) {
          addIngredient(ingredient);
        } else {
          updatedItems.push(ingredient);
        }
      }
      setAdditionalIngredients(updatedItems);
    };

    return (
      <div
        style={{
          color: "white",
          borderRadius: "50%",
        }}
        aria-label="Add Selected Ingredients"
        onClick={handleIngredientTransfer}
        className="transition-all hover:scale-125 bg-primary"
      >
        <Icons.plus />
      </div>
    );
  };

  const AdditionalIngredients = () => {
    const handleCheckboxChange = (
      section: GrocerySectionOptions,
      name: string,
      checked: boolean
    ) => {
      const updatedItems = additionalIngredients.map((item) => {
        if (
          item.category === section &&
          item.name.toLowerCase() === name.toLowerCase()
        ) {
          return { ...item, checked };
        }
        return item;
      });
      setAdditionalIngredients(updatedItems);
    };

    return (
      <div className="flex flex-col gap-x-4">
        {additionalIngredients.map((ingredient, index) => (
          <div key={index} className="flex mb-2 gap-x-4 items-center">
            <Checkbox
              checked={ingredient.checked}
              onCheckedChange={(checked: boolean) =>
                handleCheckboxChange(
                  ingredient.category,
                  ingredient.name,
                  checked
                )
              }
            />
            <p className="text-lg">
              {ingredient.name.charAt(0).toUpperCase() +
                ingredient.name.slice(1)}
            </p>
            <p className="bg-background text-foreground text-xs rounded-md p-1">
              {ingredient.quantity} {ingredient.unit}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const Decription = () => {
    return <div className="text-lg text-foreground">{recipe.description}</div>;
  };

  const Ingredients = () => {
    return (
      <ul className="list-disc list-inside">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index} className="text-lg text-foreground">
            {ingredient.quantity} {ingredient.unit} {ingredient.name}
          </li>
        ))}
      </ul>
    );
  };

  const Instructions = () => {
    return (
      <ol className="list-decimal list-inside">
        {recipe.instructions.map((instruction, index) => (
          <li key={index} className="text-lg text-foreground">
            {instruction}
          </li>
        ))}
      </ol>
    );
  };

  return (
    <>
      <RecipeSection
        title="Additional Ingredients"
        additional={<AddButtonForAdditional />}
      >
        <AdditionalIngredients />
      </RecipeSection>
      <RecipeSection title="Description">
        <Decription />
      </RecipeSection>
      <RecipeSection title="Ingredients">
        <Ingredients />
      </RecipeSection>
      <RecipeSection title="Instructions">
        <Instructions />
      </RecipeSection>
    </>
  );
};
