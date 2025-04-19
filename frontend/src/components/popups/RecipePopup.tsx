// Package Imports
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from "next/navigation";

// Local Imports
import { Card, CardContent } from "@/components/ui/card";
import pfp from "../../../public/images/pfp.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RecipeContent, RecipePopupHeader } from "@/components/page-specific/recipe/RecipePopupParts";
import { useRecipeStore } from "@/stores/recipe/store";
import { Recipe } from "@/types/recipe";
import { JSX } from "react";

interface RecipePopUpProps {
    additionalBackButtonClick?: () => void;
}

export default function RecipePopUp({ additionalBackButtonClick }: RecipePopUpProps): JSX.Element {
    const router = useRouter();
    const currentData = useRecipeStore((state) => state.currentRecipe);
    const imageUrl = useRecipeStore((state) => state.currentImageUrl);

    if (!currentData) return <></>;

    const handleBackButtonClick = () => {
        router.back();
        additionalBackButtonClick?.();
    }

    return (
        <>
            <Card className="z-[50] w-full h-full bg-card-background overflow-hidden rounded-none shadow-none md:rounded-xl md:shadow-xl lg:rounded-xl lg:shadow-xl xl:rounded-xl xl:shadow-xl">
                <CardContent className="p-0 h-full flex flex-col">

                    {currentData && (
                        <>
                            {/* Recipe Header */}
                            <RecipePopupHeader
                                imageUrl={imageUrl}
                                recipe={currentData as Recipe}
                                handleBackButton={handleBackButtonClick}
                            />

                            {/* Recipe Content */}
                            <div className="flex-1 overflow-y-auto p-4">
                                <RecipeContent recipe={currentData as Recipe} />
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </>
    );
};
