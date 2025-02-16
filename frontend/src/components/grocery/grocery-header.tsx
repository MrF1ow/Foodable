import { useGroceryStore } from "@/stores/grocery/store";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { GroceryListMainInfo } from "@/types/grocery";
import { EditButton } from "@/components/grocery/edit-button";
import { Button } from "../ui/button";

export interface GroceryHeaderProps {
  title: string;
  width: string;
}

export const GroceryHeader = ({ title, width }: GroceryHeaderProps) => {
  const {
    currentLists,
    setCurrentLists,
    currentList,
    setCurrentList,
    setItems,
    groceryLists,
  } = useGroceryStore((state) => state);

  const setList = (list: GroceryListMainInfo) => {
    if (list._id === undefined) {
      setItems([]);
    } else {
      const matchedList = groceryLists.find(
        (groceryList) => groceryList._id === list._id
      );
      setItems(matchedList?.items || []);
    }
    setCurrentList(list);
  };

  const filteredLists = currentLists.filter(
    (list) => list._id !== currentList._id
  );

  return (
    <div
      className={`inline-flex items-center bg-primary font-bold rounded-[0%_0%_75%_0%] rounded-l-lg rounded-tr-lg px-4 py-2 h-full`}
      style={{ width: width }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger
          className="text-foreground text-4xl cursor-pointer outline-none bg-transparent"
          data-testid="grocery-header"
        >
          {currentList.title || title}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {filteredLists.length > 0 ? (
            filteredLists.map((list, index) => (
              <DropdownMenuItem key={index} onClick={() => setList(list)}>
                {list.title}
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>No lists available</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <span>
        <EditButton list={currentList} />
      </span>
    </div>
  );
};
