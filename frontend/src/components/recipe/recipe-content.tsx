import React from "react";
import { Recipe } from "@/types/recipe";
import { RecipeSection } from "./recipe-section";
import { getAdditionalIngredients } from "@/utils/listItems";

export const RecipeContent = ({ recipe }: { recipe: Recipe }) => {
  const AdditionalIngredients = () => {
    const additionalIngredients = getAdditionalIngredients(recipe.ingredients);
    return (
      <ul className="list-disc list-inside">
        {additionalIngredients.map((ingredient, index) => (
          <li key={index} className="text-lg text-foreground">
            {ingredient.quantity} {ingredient.unit} {ingredient.name}
          </li>
        ))}
      </ul>
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
        children={<AdditionalIngredients />}
      />
      <RecipeSection title="Description" children={<Decription />} />
      <RecipeSection title="Ingredients" children={<Ingredients />} />
      <RecipeSection title="Instructions" children={<Instructions />} />
    </>
  );
};
