"use client";

// Package Imports
import Image from "next/image";

// Local Imports
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { useFetchImageBySourceId } from "@/server/hooks/imageHooks";
import { Recipe } from "@/types";

export const RecipeBox = ({ recipe }: Recipe) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          key={recipe._id?.toString()}
          className="w-full sm:w-40 md:w-40 aspect-square relative rounded-lg shadow-lg overflow-hidden"
        >
          <Image
            src={recipe}
            alt={recipe.title}
            fill
            className="object-cover"
          />

          <div
            className="absolute bottom-0 left-0 right-0 p-4 text-white"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <h3 className="text-lg font-semibold truncate">{recipe.title}</h3>
          </div>
        </div>
      </DialogTrigger>
    </Dialog>
  );
};
