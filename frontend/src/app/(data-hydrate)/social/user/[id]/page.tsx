"use client";

import Spinner from "@/components/Spinner";
import { getRouteParam } from "@/lib/utils/api-helpers";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import Social from "../../social";
import SocialPageInjections from "@/components/portal-injections/SocialPageInjections";
import { useFetchUserById } from "@/server/hooks/userHooks";
import { useSocialStore } from "@/stores/social/store";
import { useGeneralStore } from "@/stores/general/store";
import { FORM_NAMES } from "@/lib/constants/forms";

export default function Page() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const userId = getRouteParam(id);
  const setSelectedUser = useSocialStore((state) => state.setSelectedUser);
  const setCurrentForm = useGeneralStore((state) => state.setCurrentMainPortalForm);
  const setShowMainPortal = useGeneralStore((state) => state.setShowMainPortal);

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
      setCurrentForm(FORM_NAMES.FOLLOWER_POPUP);
      setShowMainPortal(true);
    }
  }, [user, isErrorUser, setSelectedUser]);

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
