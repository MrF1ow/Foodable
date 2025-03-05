"use client";

import { useGeneralStore } from "@/stores/general/store";
import { useSavedItemsStore } from "@/stores/saved/store";
import { SavedItemPopup } from "@/components/common/saved/saved-item-popup";
import Loader from "@/components/loader";

export default function SavedItemsRightSide() {
  const splitLayout = useGeneralStore((state) => state.splitLayout);

  const currentItem = useSavedItemsStore((state) => state.currentItem);

  return <>{splitLayout && currentItem ? <SavedItemPopup /> : <Loader />}</>;
}
