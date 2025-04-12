import Recipes from "@/app/(data-hydrate)/recipe/recipes";
import FetchData from "@/app/_fetchData";
import { HydrationBoundary } from "@tanstack/react-query";

export default async function RecipePage() {
  const dehydratedClient = await FetchData({
    grocery: true,
    saved: true,
    recipes: true,
  });

  return (
    <HydrationBoundary state={dehydratedClient}>
      <Recipes />
    </HydrationBoundary>
  );
}
