"use client";

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
import { InputCard } from "@/components/common/input-card/input-card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useGeneralStore } from "@/stores/general/store";
import { useGroceryStore } from "@/stores/grocery/store";
import { useFetchKrogerLocations } from "@/server/hooks/krogerHooks";
import { showToast } from "@/providers/react-query-provider";
import { TOAST_SEVERITY } from "@/lib/constants/ui";

export const FindPrice = () => {
  const isMobile = useGeneralStore((state) => state.isMobile);
  const setSplitLayout = useGeneralStore((state) => state.setSplitLayout);
  const setCurrentForm = useGroceryStore((state) => state.setCurrentForm);
  const setZipCode = useGeneralStore((state) => state.setZipCode);
  const zipCode = useGeneralStore((state) => state.zipCode);

  const { krogerLocations, refetchKrogerLocations } =
    useFetchKrogerLocations(zipCode);

  const form = useForm({
    defaultValues: {
      zipCode: "",
      selectStores: "",
      searchBy: "",
    },
  });

  async function onSubmit(data: any) {
    let locationId = "";
    try {
      setZipCode(data.zipCode);
      const { data: updatedKrogerLocations } = await refetchKrogerLocations();
      if (
        !updatedKrogerLocations ||
        !updatedKrogerLocations.data ||
        updatedKrogerLocations.data.length === 0
      ) {
        showToast(
          TOAST_SEVERITY.ERROR,
          "No Kroger locations found",
          "Try another ZIP code",
          3000
        );
        return;
      }
      const firstLocationId = updatedKrogerLocations.data[0]?.locationId;

      showToast(
        TOAST_SEVERITY.SUCCESS,
        "Location Found",
        `Kroger stores located`,
        3000
      );

      console.log("krogerLocations: ", updatedKrogerLocations);
      console.log("LocationId: ", firstLocationId);
      locationId = firstLocationId;
    } catch (error) {
      showToast(
        TOAST_SEVERITY.ERROR,
        "Error",
        "Failed to fetch Kroger locations",
        3000
      );
      return;
    }
    console.log(data);
  }

  const handleInputClose = () => {
    setCurrentForm("", isMobile, setSplitLayout);
  };

  return (
    <Form {...form}>
      <InputCard
        title="Find Price"
        onClick={handleInputClose}
        content={
          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-2xl">Enter Zip Code</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-24 !text-xl h-12"
                      placeholder="123456"
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
