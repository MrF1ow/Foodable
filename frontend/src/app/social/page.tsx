import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { checkRole } from "@/utils/roles";
import Social from "./social";
import AuthOptions from "@/components/auth-options";
import FetchUserData from "../_fetchData";

export default async function SocialPage() {
  const queryClient = await FetchUserData();

  // Check if user has the role
  const isUser = await checkRole("user");

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {isUser && <Social />}
      {!isUser && <AuthOptions />}
    </HydrationBoundary>
  );
}
