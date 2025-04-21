"use client";

import Spinner from "@/components/Spinner";
import { getRouteParam } from "@/lib/utils/routeHelpers";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import Social from "../../social";
import SocialPageInjections from "@/components/portal-injections/SocialPageInjections";
import { useFetchUserById } from "@/server/hooks/userHooks";
import { useSocialStore } from "@/stores/social/store";
import { FollowingPopup } from "@/components/page-specific/social/SocialFollowerPopup";

export default function Page() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const userId = getRouteParam(id);
  const setSelectedUser = useSocialStore((state) => state.setSelectedUser);
  const setIsFollowerPopupOpen = useSocialStore(
    (state) => state.setIsFollowerPopupOpen
  );

  const { user, isLoadingUser, isErrorUser } = useFetchUserById({
    id: userId!,
    enabled: !!userId,
  });

  useEffect(() => {
    if (isErrorUser) {
      console.error("Error fetching user:", isErrorUser);
    }

    if (user) {
      console.log("Fetched user:", user);
      setSelectedUser(user);
      setIsFollowerPopupOpen(true);
    }
  }, [user, isErrorUser, setSelectedUser, setIsFollowerPopupOpen]);

  if (isLoadingUser) {
    return <Spinner />;
  }

  return (
    <>
      <Social />
      <SocialPageInjections />
    </>
  );
}
