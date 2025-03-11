import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { checkRole } from "@/utils/roles";
import Settings from "./settingsPage";
import AuthOptions from "@/components/auth-options";
import FetchUserData from "../../_fetchData";

export default async function SettingsPage() {
  const queryClient = await FetchUserData();

  // Check if user has the role
  const isUser = await checkRole("user");

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {isUser && <Settings />}
      {!isUser && <AuthOptions />}
    </HydrationBoundary>
  );
}
