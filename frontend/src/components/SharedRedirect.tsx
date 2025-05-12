"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRecipeStore } from "@/stores/recipe/store";
import { useGeneralStore } from "@/stores/general/store";
import { FORM_NAMES } from "@/lib/constants/forms";
import { useGroceryStore } from "@/stores/grocery/store";

export default function SharedRedirect({
  type,
  id,
}: {
  type: string;
  id: string;
}) {
  const router = useRouter();
  const setCurrentRecipe = useRecipeStore((state) => state.setCurrentRecipe);
  const setCurrentList = useGroceryStore((state) => state.setCurrentList);
  const setCurrentForm = useGeneralStore(
    (state) => state.setCurrentMainPortalForm
  );
  const setIsSharedView = useGroceryStore((state) => state.setIsSharedView);

  useEffect(() => {
    async function fetchAndRedirect() {
      try {
        const endpoint =
          type === "recipe"
            ? "recipes"
            : type === "grocery"
            ? "user/grocery"
            : null;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}?id=${id}`
        );
        if (!res.ok) throw new Error("Not found");

        const data = await res.json();
        console.log("Fetched data:", data);

        if (type === "recipe") {
          setCurrentForm(FORM_NAMES.RECIPE);
          setCurrentRecipe(data);
        }
        if (type === "grocery") {
          setCurrentForm(FORM_NAMES.GROCERY_LIST);
          setCurrentList(data);
          setIsSharedView(true);
          console.log("Fetched grocery list data:", data);
        }

        router.replace(`/social/${type}/${id}`);
      } catch (err) {
        console.error(err);
        router.replace("/not-found");
      }
    }

    fetchAndRedirect();
  }, [type, id, setCurrentRecipe, router]);

  return <p className="p-4 text-center">Redirecting to shared {type}...</p>;
}
