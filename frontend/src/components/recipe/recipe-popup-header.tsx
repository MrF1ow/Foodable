import { Recipe } from "@/types/recipe";
import { SaveBookmark } from "@/components/saved/save-bookmark";
import { RecipeMetaData } from "@/types/saved";

interface RecipePopupHeaderProps {
  imageUrl: string;
  recipe: Recipe;
  metadata: RecipeMetaData;
}

export const RecipePopupHeader = ({
  imageUrl,
  recipe,
  metadata,
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
        <SaveBookmark data={metadata} />
      </div>
    </div>
  );
};
