import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/utils/user";
import { SavedRecipeMetaData } from "@/types/saved";

export async function GET() {
  try {
    const { userData, error, status } = await getCurrentUser<{
      createdRecipes: SavedRecipeMetaData[];
    }>({
      createdRecipes: 1,
    });

    if (!userData) {
      return NextResponse.json({ message: error }, { status });
    }

    return NextResponse.json(userData.createdRecipes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 },
    );
  }
}
