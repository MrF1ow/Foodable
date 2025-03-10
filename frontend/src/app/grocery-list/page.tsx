import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/app/get-query-client";
import GroceryList from "@/app/grocery-list/groceryList";
import AuthOptions from "@/components/auth-options";
import { checkRole } from "@/utils/roles";
import FetchUserData from "../_fetchData";

export default async function RecipePage() {
  const queryClient = await FetchUserData();

  // Check if user has the role
  const isUser = await checkRole("user");

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {isUser && <GroceryList />}
      {!isUser && <AuthOptions />}
    </HydrationBoundary>
  );
}
