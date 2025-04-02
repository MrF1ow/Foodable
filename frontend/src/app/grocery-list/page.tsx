import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import GroceryList from "@/app/grocery-list/groceryList";
import FetchUserData from "../_fetchData";
import { checkRole } from "@/utils/roles";

export default async function RecipePage() {
  const queryClient = await FetchUserData();

  // prevents the grocery list to fetch data if the user is a guest
  const user = await checkRole("user");

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GroceryList renderContent={true} isUser={user} />
    </HydrationBoundary>
  );
}
