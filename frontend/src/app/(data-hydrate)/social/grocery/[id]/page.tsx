"use client";

import Social from "@/app/(data-hydrate)/social/social";
import SocialPageInjections from "@/components/portal-injections/SocialPageInjections";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useGroceryStore } from "@/stores/grocery/store";
import Spinner from "@/components/Spinner";

export default function Page() {
  const params = useParams<{ id: string }>();
  const groceryId = params.id;

  const currentList = useGroceryStore((state) => state.currentList);
  const [loading, setLoading] = useState(true);
  const setIsSharedView = useGroceryStore((state) => state.setIsSharedView);
  useEffect(() => {
    setIsSharedView(false);
  }, []);

  useEffect(() => {
    if (currentList && currentList._id === groceryId) {
      setLoading(false);
    } else {
      console.warn("Missing or mismatched list in Zustand");
      setLoading(false);
    }
  }, [groceryId, currentList]);

  if (loading || !currentList || currentList._id !== groceryId) {
    return <Spinner />;
  }
  return (
    <>
      <Social />
      <SocialPageInjections />
    </>
  );
}
