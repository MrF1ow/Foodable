"use client";

// Local Imports
import { useGroceryStore } from "@/stores/grocery/store";
import { useGeneralStore } from "@/stores/general/store";
import { useUserStore } from "@/stores/user/store";
import List from "@/components/page-specific/grocery/GroceryList";
import type { GroceryList } from "@/types/grocery";
import GroceryListDataFetcher from "@/components/data-fetchers/GroceryDataFetcher";
import SavedDataFetcher from "@/components/data-fetchers/SavedDataFetcher";
import { FORM_NAMES } from "@/lib/constants/forms";
import AssistantButton from "@/components/buttons/AssistantButton";
import GroceryPageInjections from "@/components/portal-injections/GroceryPageInjections";
import GuestDataMonitor from "@/components/GuestDataMonitor";

interface GroceryListProps {
  isUser: boolean;
  renderContent: boolean;
  className?: string;
}

export default function GroceryList({
  isUser,
  renderContent,
  className,
}: GroceryListProps) {

  const splitLayout = useGeneralStore((state) => state.splitLayout);
  const isMobile = useGeneralStore((state) => state.isMobile);
  const currentList = useGroceryStore((state) => state.currentList);
  const setCurrentForm = useGeneralStore((state) => state.setCurrentForm);
  const setShowPortal = useGeneralStore((state) => state.setShowPortal);
  const setSplitLayout = useGeneralStore((state) => state.setSplitLayout);

  const handleAssitantButtonClick = () => {
    setCurrentForm(FORM_NAMES.LIST_ASSISTANT);
    setShowPortal(true);
    setSplitLayout(true);
  }

  return (
    <>
      {isUser && (
        <>
          <GroceryListDataFetcher />
          <SavedDataFetcher />
        </>
      )}
      {!isUser && <GuestDataMonitor />}
      {currentList && <List className={className} />}
      {renderContent && !splitLayout && !isMobile && isUser && (
        <AssistantButton mobile={false} handleOnClick={handleAssitantButtonClick} />
      )}
      <GroceryPageInjections />
    </>
  );
}
