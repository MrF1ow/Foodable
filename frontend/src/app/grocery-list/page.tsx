import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/app/get-query-client";
import GroceryList from "@/app/grocery-list/groceryList";
import AuthOptions from "@/components/auth-options";
import { GROCERY_LISTS } from "@/lib/constants/process";
import { GroceryApi } from "@/server/api/groceryListApi";
import { checkRole } from "@/utils/roles";

export default async function RecipePage() {
  const queryClient = getQueryClient();

  // Check if user has the role
  const isUser = await checkRole("user");

  // Prefetch recipes data
  await queryClient.prefetchQuery({
    queryKey: [GROCERY_LISTS],
    queryFn: () => GroceryApi.fetchAllGroceryLists(true),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {isUser && <GroceryList />}
      {!isUser && <AuthOptions />}
    </HydrationBoundary>
  );
}
