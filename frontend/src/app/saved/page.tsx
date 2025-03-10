import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { checkRole } from "@/utils/roles";
import Saved from "@/app/saved/saved";
import AuthOptions from "@/components/auth-options";
import FetchUserData from "../_fetchData";

export default async function RecipePage() {
  const queryClient = await FetchUserData();

  // Check if user has the role
  const isUser = await checkRole("user");

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {isUser && <Saved />}
      {!isUser && <AuthOptions />}
    </HydrationBoundary>
  );
}
