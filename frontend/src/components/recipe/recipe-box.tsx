"use client";

// Package Imports
import Image from "next/image";
import { useEffect, useState } from "react";
// import { useRouter, usePathname } from "next/navigation";

// Local Imports
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import logo from "../../../public/images/logo_current_no_shadow.png";
import { useFetchImageBySourceId } from "@/server/hooks/imageHooks";
import { Recipe } from "@/types";
import { DialogTitle } from "@radix-ui/react-dialog";

export const RecipeBox = ({ recipe }: { recipe: Recipe }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const {
    data: response,
    isLoading,
    error,
  } = useFetchImageBySourceId(recipe._id ? recipe._id.toString() : "");

  useEffect(() => {
    if (response && response.base64Image) {
      setImageUrl(response.base64Image);
    }
  }, [response]);

  if (error) {
    console.error("Error fetching image:", error);
  }

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
              src={imageUrl || logo}
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
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div>Hello World</div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
