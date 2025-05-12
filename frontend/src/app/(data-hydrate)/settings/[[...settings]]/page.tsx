import { checkRole } from "@/lib/utils/clerk-utils";
import Settings from "./settingsPage";
import { NotUserOptions } from "@/components/authentication/AuthOptions";
import FetchData from "@/app/_fetchData";
import { HydrationBoundary } from "@tanstack/react-query";

export default async function SettingsPage() {
  const dehydratedClient = await FetchData({
    userData: true,
  });
  // Check if user has the role
  const isUser = await checkRole("user");

  if (!isUser) {
    return <NotUserOptions />;
  }

  return (
    <HydrationBoundary state={dehydratedClient}>
      <Settings />
    </HydrationBoundary>
  );
}
