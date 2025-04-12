import { checkRole } from "@/lib/utils/roles";
import Saved from "./saved";
import { NotUserOptions } from "@/components/authentication/AuthOptions";
import FetchData from "@/app/_fetchData";
import { HydrationBoundary } from "@tanstack/react-query";

export default async function SavedPage() {
  const dehydratedClient = await FetchData({
    grocery: true,
    saved: true,
  });

  // Check if user has the role
  const isUser = await checkRole("user");

  if (!isUser) {
    return <NotUserOptions />
  }

  return (
    <HydrationBoundary state={dehydratedClient}>
      <Saved />
    </HydrationBoundary>
  );
}
