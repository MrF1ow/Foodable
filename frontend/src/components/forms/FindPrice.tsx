"use client";

import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import InputCard from "@/components/InputCard";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useGeneralStore } from "@/stores/general/store";
import { useFetchKrogerLocations } from "@/server/hooks/krogerHooks";
import { useFetchKrogerProducts } from "@/server/hooks/krogerHooks";
import { useEffect, useState } from "react";
import { JSX } from "react";
import { FormName } from "@/lib/constants/forms";
import { CurrentFormFunction } from "@/types";
import { useGroceryStore } from "@/stores/grocery/store";
import { fetchStorePricesFromGroceryMap } from "@/lib/utils/listItems";
import { useWatch } from "react-hook-form";

export default function FindPrice({ setCurrentForm } : CurrentFormFunction): JSX.Element {
  const setShowPortal = useGeneralStore((state) => state.setShowPortal);
  const setSplitPage = useGeneralStore((state) => state.setSplitLayout);
  const groceryMap = useGroceryStore((state) => state.map);
  const setStorePrices = useGroceryStore(
    (state) => state.setStorePricesByStore
  );
  const storePrices = useGroceryStore((state) => state.storePricesByStore);
  const storeTotal = useGroceryStore((state) => state.storeTotal);
  const setStoreTotal = useGroceryStore((state) => state.setStoreTotal);
  const clearStorePrices = useGroceryStore((state) => state.clearStorePrices);
  const clearStoreTotal = useGroceryStore((state) => state.clearStoreTotal);

  const zipCode = useGeneralStore((state) => state.zipCode);
  const setZipCode = useGeneralStore((state) => state.setZipCode);
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [selectedStoreName, setSelectedStoreName] = useState<string>("");
  const [isFinding, setIsFinding] = useState(false);

  const { krogerLocations, refetchKrogerLocations } =
    useFetchKrogerLocations(zipCode);

  const form = useForm({
    defaultValues: {
      zipCode: zipCode || "",
      selectStores: [] as string[],
      searchBy: "",
    },
  });

  const watchedZip = useWatch({
    control: form.control,
    name: "zipCode",
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (watchedZip && watchedZip.length === 5) {
        setZipCode(watchedZip);
        refetchKrogerLocations();
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [watchedZip, setZipCode, refetchKrogerLocations]);

  async function onSubmit(data: any) {
    setIsFinding(true);
    try {
      clearStorePrices();
      clearStoreTotal();
      setZipCode(data.zipCode);
      const result = await refetchKrogerLocations();
      const updatedKrogerLocations = result?.data;
      if (
        !updatedKrogerLocations ||
        !updatedKrogerLocations.data ||
        updatedKrogerLocations.data.length === 0
      ) {
        return;
      }
      const selectedStores: string[] = data.selectStores;
      if (!selectedStores || selectedStores.length === 0) return;

      let bestStoreId: string | null = null;
      let bestTotal: number = -1;
      let bestItemCount: number = -1;
      const tempStorePrices = new Map<string, Map<string, number>>();
      let bestStoreName: string | null = null;

      for (const storeId of data.selectStores) {
        const prices = await fetchStorePricesFromGroceryMap(
          storeId,
          groceryMap
        );
        tempStorePrices.set(storeId, prices);
        setStorePrices(storeId, prices);
        console.log("Store prices:", tempStorePrices);
        let total = 0;
        let itemCount = 0;
        for (const [key, item] of groceryMap.entries()) {
          const unitPrice = prices.get(key);
          if (unitPrice !== undefined) {
            total += unitPrice * item.quantity;
            itemCount++;
          }
        }
        if (
          itemCount > bestItemCount ||
          (itemCount === bestItemCount && total < bestTotal)
        ) {
          bestStoreId = storeId;
          bestTotal = total;
          bestItemCount = itemCount;
          bestStoreName =
            updatedKrogerLocations.data.find(
              (store: any) => store.locationId === storeId
            )?.name || "";
        }
      }
      if (bestStoreId !== null) {
        setStoreTotal(bestTotal);
        setSelectedStoreId(bestStoreId);
        setSelectedStoreName(bestStoreName || "");
      }
    } catch (error) {
      console.error("Error finding prices:", error);
    } finally {
      setIsFinding(false);
    }
  }
  useEffect(() => {
    if (zipCode) {
      form.setValue("zipCode", zipCode);
    }
  }, [zipCode, form]);

  const handleInputClose = () => {
    setCurrentForm(null);
    setShowPortal(false);
    setSplitPage(false);
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
                      placeholder={zipCode || "12345"}
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
                    <div className="max-h-72 overflow-y-auto">
                      <div className="flex flex-col gap-2">
                        {krogerLocations?.data?.map((location: any) => {
                          const isChecked = field.value?.includes(
                            location.locationId
                          );
                          return (
                            <FormItem
                              key={location.locationId}
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    const value = location.locationId;
                                    const newValue =
                                      checked && checked !== "indeterminate"
                                        ? [...(field.value || []), value]
                                        : (field.value || []).filter(
                                            (v: string) => v !== value
                                          );

                                    field.onChange(newValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-lg">
                                {location.name}
                              </FormLabel>
                            </FormItem>
                          );
                        })}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="searchBy"
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
            {storeTotal !== null && (
              <>
                <div className="text-center text-2xl text-green-700">
                  Estimated Total: ${storeTotal.toFixed(2)}
                </div>
                <div className="text-center text-lg text-muted-foreground">
                  {selectedStoreName
                    ? `Best Store is ${selectedStoreName}: ${
                        storePrices.get(selectedStoreId)?.size ?? 0
                      }/${groceryMap.size} Items Found`
                    : `No Store Selected is Good for This List`}
                </div>
              </>
            )}
          </div>
        }
        footer={
          <div className="flex justify-center ">
            <Button
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              className="btn-primary p-8 text-3xl"
              disabled={isFinding}
            >
              {isFinding ? "Finding..." : "Find"}
            </Button>
          </div>
        }
      />
    </Form>
  );
}
