"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useFetchImageById } from "@/server/hooks/imageHooks";
import { isValidObjectId } from "@/lib/utils/typeValidation/general";

// Need to add onClick functionality to the button so that the users can go to different pages
interface SocialItemProps {
  title: string;
  imageId?: string;
  icon?: React.ReactNode;
  handleRemove?: () => void;
}

export default function SocialItem({
  title,
  imageId,
  icon,
  handleRemove,
}: SocialItemProps) {
  // will only run if the imageId is something and if that something is a valid object ID
  const { image, isLoadingImage, errorImage } = useFetchImageById(imageId || "", {
    enabled: !!imageId && isValidObjectId(imageId),
  });

  if (isLoadingImage) {
    return <div>Loading...</div>;
  }

  if (errorImage) {
    return <div>Error loading image</div>;
  }
  return (
    <div className="flex items-center bg-background p-4 rounded-md shadow-md mb-4 text-foreground">
      {imageId && (
        <Avatar className="w-10 h-10 mr-4">
          <AvatarImage
            src={image.base64Image}
            alt={`${title} Avatar`}
            className="object-cover w-full h-full rounded-full"
          />
          <AvatarFallback>{title.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      )}
      <div className="flex-grow text-lg font-semibold">{title}</div>
      {handleRemove && (
        <Button
          variant="outline"
          className="text-red-500 border-2 border-red-500 p-2 rounded-full"
          onClick={handleRemove}
        >
          {icon}
        </Button>
      )}
    </div>
  );
}
