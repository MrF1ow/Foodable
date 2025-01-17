"use client";

// Package Imports
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

// Local Imports
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { useFetchImageBySourceId } from "@/server/hooks/imageHooks";
import { Recipe } from "@/types";

export const RecipeBox = ({ recipe }: { recipe: Recipe }) => {
  const router = useRouter();
  const pathName = usePathname();

  function createSearchWithID() {
    const id = recipe._id?.toString() ?? "";
    const currentUrl = pathName;
    const newUrl = `${currentUrl}/id?${id}`;
    router.push(newUrl);
  }

  const { data: image, isLoading } = useFetchImageBySourceId(
    recipe._id ? recipe._id.toString() : ""
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          key={recipe._id?.toString()}
          className="w-full sm:w-40 md:w-40 aspect-square relative rounded-lg shadow-lg overflow-hidden"
        >
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-full bg-gray-200">
              {/* Add a loading indicator */}
              <span className="text-gray-500">Loading...</span>
            </div>
          ) : (
            <Image
              src={image}
              alt={recipe.title}
              fill
              className="object-cover"
            />
          )}
          ;
          <div
            className="absolute bottom-0 left-0 right-0 p-4 text-white"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <h3 className="text-lg font-semibold truncate">{recipe.title}</h3>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogDescription>
          <p>{recipe.description}</p>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
