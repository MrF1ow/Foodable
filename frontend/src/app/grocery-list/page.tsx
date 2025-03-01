import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/app/get-query-client";
import GroceryList from "@/app/grocery-list/groceryList";
import { GROCERY_LISTS } from "@/lib/constants/process";
import { GroceryApi } from "@/server/api/groceryListApi";

export default async function RecipePage() {
  const queryClient = getQueryClient();

  // Prefetch recipes data
  await queryClient.prefetchQuery({
    queryKey: [GROCERY_LISTS],
    queryFn: () => GroceryApi.fetchAllGroceryLists(false),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GroceryList />
    </HydrationBoundary>
  );
}
