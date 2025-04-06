import GroceryList from "@/app/(data-hydrate)/grocery-list/groceryList";
import { checkRole } from "@/utils/roles";

export default async function RecipePage() {

  // prevents the grocery list to fetch data if the user is a guest
  const user = await checkRole("user");

  return (
    <GroceryList renderContent={true} isUser={user} />
  );
}
