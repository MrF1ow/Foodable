import { checkRole } from "@/lib/utils/roles";
import Settings from "./settingsPage";
import AuthOptions from "@/components/authentication/AuthOptions";
import FetchData from "@/app/_fetchData";
import { HydrationBoundary } from "@tanstack/react-query";

export default async function SettingsPage() {
  const dehydratedClient = await FetchData({
    userData: true
  });
  // Check if user has the role
  const isUser = await checkRole("user");

  if (!isUser) {
    return <AuthOptions />;
  }

  return (
    <HydrationBoundary state={dehydratedClient}>
      <Settings />
    </HydrationBoundary>
  );
}
