import {
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputCard } from "@/components/input-card/input-card";
import { Button } from "@/components/ui/button";

interface AddItemCardProps {
  setSplitLayout: (value: boolean) => void;
}

export const AddItemCard = ({ setSplitLayout }: AddItemCardProps) => {
  const form = useForm();

  function onSubmit(data: any) {
    console.log(data);
  }

  const handleInputClose = () => {
    setSplitLayout(false);
    console.log("Close button clicked");
  };

  return (
    <Form {...form}>
      <InputCard
        title="Add Item"
        onClick={handleInputClose}
        content={
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="itemName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter item name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">Quantity</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter quantity" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">Select Category</FormLabel>
                  <div className="border rounded shadow-sm p-2">
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          {field.value || "Bakery"}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {[
                            "Bakery",
                            "Dairy",
                            "Produce",
                            "Meat",
                            "Pantry",
                            "Frozen",
                          ].map((category) => (
                            <DropdownMenuItem
                              key={category}
                              onClick={() => field.onChange(category)}
                            >
                              {category}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormControl>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        }
        footer={
          <div className="flex justify-center ">
            <Button
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              className="btn-primary p-8 text-3xl"
            >
              Submit
            </Button>
          </div>
        }
      />
    </Form>
  );
};
