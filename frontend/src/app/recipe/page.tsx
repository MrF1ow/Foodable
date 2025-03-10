import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import Recipes from "@/app/recipe/recipes";
import FetchUserData from "../_fetchData";

export default async function RecipePage() {
  const queryClient = await FetchUserData();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Recipes />
    </HydrationBoundary>
  );
}
