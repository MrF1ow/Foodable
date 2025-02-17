import { useGroceryStore } from "@/stores/grocery/store";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { EditButton } from "@/components/grocery/edit-button";
import { GroceryMetaData, UnsavedGroceryMetaData } from "@/types/saved";

export interface GroceryHeaderProps {
  metadata: GroceryMetaData | UnsavedGroceryMetaData;
  width: string;
}

export const GroceryHeader = ({ metadata, width }: GroceryHeaderProps) => {
  const setCurrentListById = useGroceryStore(
    (state) => state.setCurrentGroceryListId
  );
  const fetchFullGroceryList = useGroceryStore(
    (state) => state.fetchFullGroceryList
  );
  const { currentLists, currentList } = useGroceryStore((state) => state);

  const setList = async () => {
    if ("_id" in metadata && metadata._id) {
      setCurrentListById(metadata._id.toString());
      await fetchFullGroceryList(metadata._id.toString());
    }
  };

  const filteredLists =
    "_id" in metadata && metadata._id
      ? currentLists.filter((list) => list._id !== metadata._id)
      : currentLists;

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
          {currentList.metadata?.title || "New List"}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {filteredLists.length > 0 ? (
            filteredLists.map((list, index) => (
              <DropdownMenuItem key={index} onClick={() => setList()}>
                {list.title}
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>No lists available</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <span>
        <EditButton metadata={metadata} />
      </span>
    </div>
  );
};
