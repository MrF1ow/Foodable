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
import { InputCard } from "@/components/input-card/input-card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

interface FindPriceCardProps {
  setSplitLayout: (value: boolean) => void;
}

export const FindPriceCard = ({ setSplitLayout }: FindPriceCardProps) => {
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
        title="Find Price"
        onClick={handleInputClose}
        content={
          <div className="flex flex-col gap-6 mt-6">
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem className="flex items-center w-full">
                  <FormLabel className="text-2xl mr-20">
                    Enter Zip Code
                  </FormLabel>
                  <FormControl className="flex-1">
                    <Input
                      className="w-auto !text-xl h-12"
                      placeholder="Enter Zip Code"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="selectStores"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-2xl">Select Stores</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="store 1" />
                        </FormControl>
                        <FormLabel className="text-lg">Fred Meyer</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="store 2" />
                        </FormControl>
                        <FormLabel className="text-lg">Target</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="store 3" />
                        </FormControl>
                        <FormLabel className="text-lg">Walmart</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="selectStores"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-2xl">Search By</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="store 1" />
                        </FormControl>
                        <FormLabel className="text-lg">Lowest Price</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="store 2" />
                        </FormControl>
                        <FormLabel className="text-lg">Current List</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
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
              Find
            </Button>
          </div>
        }
      />
    </Form>
  );
};
