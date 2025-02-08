import { Recipe } from "@/types/recipe";
import { GeneralSave } from "@/components/general-save";

interface RecipePopupHeaderProps {
  imageUrl: string;
  recipe: Recipe;
}

export const RecipePopupHeader = ({
  imageUrl,
  recipe,
}: RecipePopupHeaderProps) => {
  return (
    <div className="w-full h-[40%] relative">
      <img
        src={imageUrl}
        alt={recipe.title}
        className="object-cover w-full h-full"
      />
      <div className="absolute w-full bottom-0 left-0 p-4 text-white bg-black bg-opacity-50">
        <h3 className="text-4xl tracking-widest font-bold truncate p-2">
          {recipe.title}
        </h3>
        <GeneralSave data={recipe} />
      </div>
    </div>
  );
};
