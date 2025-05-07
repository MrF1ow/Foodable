import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { getCurrentUser } from "@/lib/utils/user";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userData, error, status } = await getCurrentUser<{ currentGroceryList: ObjectId }>({
      currentGroceryList: 1,
    });

    if (!userData) {
      return NextResponse.json({ message: error }, { status });
    }

    return NextResponse.json(userData.currentGroceryList || null, { status: 200 });
  } catch (error) {
    console.error("Error fetching current grocery list: ", error);
    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
