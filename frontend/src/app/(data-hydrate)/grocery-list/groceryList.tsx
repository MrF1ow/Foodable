"use client";

// Local Imports
import { useGroceryStore } from "@/stores/grocery/store";
import { useGeneralStore } from "@/stores/general/store";
import { List } from "@/components/common/grocery/list";
import type { GroceryList } from "@/types/grocery";
import GroceryListDataFetcher from "@/components/common/grocery/grocery-list-data-fetcher";
import SavedDataFetcher from "@/components/common/saved/saved-data-fetcher";
import { FORM_NAMES } from "@/lib/constants/forms";
import AssistantButton from "@/components/buttons/AssistantButton";
import GroceryPageInjections from "@/components/portal-injections/GroceryPageInjections";

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
      {isUser && <GroceryListDataFetcher />}
      {isUser && <SavedDataFetcher />}
      {currentList && <List className={className} />}
      {renderContent && !splitLayout && !isMobile && (
        <AssistantButton mobile={false} handleOnClick={handleAssitantButtonClick} />
      )}
      <GroceryPageInjections />
    </>
  );
}
