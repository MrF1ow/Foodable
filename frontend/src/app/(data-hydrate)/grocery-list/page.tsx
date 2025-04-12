import GroceryList from "@/app/(data-hydrate)/grocery-list/groceryList";
import { checkRole } from "@/lib/utils/roles";
import FetchData from "@/app/_fetchData";
import { HydrationBoundary } from "@tanstack/react-query";

export default async function GroceryListPage() {

  const dehydratedClient = await FetchData({
    grocery: true,
    saved: true,
  });

  // prevents the grocery list to fetch data if the user is a guest
  const user = await checkRole("user");

  return (
    <HydrationBoundary state={dehydratedClient}>
      <GroceryList renderContent={true} isUser={user} />
    </HydrationBoundary>
  );
}
