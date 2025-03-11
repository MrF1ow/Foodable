import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import GroceryList from "@/app/grocery-list/groceryList";
import FetchUserData from "../_fetchData";

export default async function RecipePage() {
  const queryClient = await FetchUserData();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GroceryList renderContent={true} />
    </HydrationBoundary>
  );
}
