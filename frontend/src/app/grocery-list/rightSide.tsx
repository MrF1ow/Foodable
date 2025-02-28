"use client";

import { useGroceryStore } from "@/stores/grocery/store";
import { AddItem } from "@/components/common/grocery/add-item";
import { FindPrice as FindPrice } from "@/components/common/grocery/find-price";
import { HelperCard } from "@/components/common/grocery/list-helper";

export default function RightSideCard() {
  const currentCard = useGroceryStore((state) => state.currentForm);
  switch (currentCard) {
    case "addItem":
      return <AddItem className="h-full" />;
    case "findPrice":
      return <FindPrice />;
    case "groceryHelper":
      return <HelperCard />;
    default:
      return null;
  }
}
