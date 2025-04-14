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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useGeneralStore } from "@/stores/general/store";
import { useFetchKrogerLocations } from "@/server/hooks/krogerHooks";
import { useFetchKrogerProducts } from "@/server/hooks/krogerHooks";
import { useEffect, useState } from "react";
import { JSX } from "react";

export default function FindPrice(): JSX.Element {
  const setCurrentForm = useGeneralStore((state) => state.setCurrentForm);
  const setShowPortal = useGeneralStore((state) => state.setShowPortal);
  const setSplitPage = useGeneralStore((state) => state.setSplitLayout);
  const TestzipCode = useGeneralStore((state) => state.zipCode);
  console.log("Test zip code", TestzipCode);
  //   const setZipCode = useGeneralStore((state) => state.setZipCode);
  //   const zipCode = useGeneralStore((state) => state.zipCode);
  const [term, setTerm] = useState("milk");
  const [locationId, setLocationId] = useState("70100070");

  const zipCode = useGeneralStore((state) => state.zipCode);
  const setZipCode = useGeneralStore((state) => state.setZipCode);

  const { krogerLocations, refetchKrogerLocations } =
    useFetchKrogerLocations(zipCode);

  const {
    krogerProducts,
    isLoadingKrogerProducts,
    refetchKrogerProducts,
    errorKrogerProducts,
  } = useFetchKrogerProducts(term, locationId);

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
        return;
      }
      const firstLocationId = updatedKrogerLocations.data[0]?.locationId;

      locationId = firstLocationId;
      console.log("Locations from Kroger:", updatedKrogerLocations);
    } catch (error) {
      return;
    }

    if (locationId !== "") {
      setLocationId(locationId);
      setTerm("milk");
      try {
        const products = await refetchKrogerProducts();
        // console.log("Products from Kroger:", products);
      } catch (error) {}
    }
  }

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
}

