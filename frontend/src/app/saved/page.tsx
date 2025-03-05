import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/app/get-query-client";
import { SAVED_ITEMS } from "@/lib/constants/process";
import { SavedItemsApi } from "@/server/api/savedItemsApi";
import Saved from "@/app/saved/saved";

export default async function RecipePage() {
  const queryClient = getQueryClient();

  // Prefetch recipes data
  await queryClient.prefetchQuery({
    queryKey: [SAVED_ITEMS],
    queryFn: () => SavedItemsApi.getAllSavedItems(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Saved />
    </HydrationBoundary>
  );
}
