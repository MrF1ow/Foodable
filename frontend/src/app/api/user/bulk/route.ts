import { NextResponse } from "next/server";
import { DELETE as removeGroceryListsFromAll } from "./removeGroceryListsFromAll";
import { DELETE as removeRecipesFromAll } from "./removeRecipesFromAll";
import { DELETE as removeImagesFromAll } from "./removeImageFromAll"

export async function DELETE(request: Request) {
    try {
        const { id, type } = await request.json();

        if (type === "recipe") {
            return await removeRecipesFromAll(id);
        }

        if (type === "grocery") {
            return await removeGroceryListsFromAll(id);
        }

        if (type === "image") {
            return await removeImagesFromAll(id);
        }

        return NextResponse.json(
            { message: "Invalid type provided." },
            { status: 400 }
        );
    } catch (err) {
        console.error("Error handling bulk deletion:", err);
        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}