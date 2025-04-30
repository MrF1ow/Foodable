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
import InputCard from "@/components/InputCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useGeneralStore } from "@/stores/general/store";
import { JSX } from "react";
import { CurrentFormFunction } from "@/types";

export default function ListHelper({ setCurrentForm } : CurrentFormFunction): JSX.Element {
  const isMobile = useGeneralStore((state) => state.isMobile);
  const setSplitPage = useGeneralStore((state) => state.setSplitLayout);
  const setShowPortal = useGeneralStore((state) => state.setShowPortal);
  const form = useForm();

  function onSubmit(data: any) {
    console.log(data);
  }

  const handleInputClose = () => {
    setCurrentForm(null);
    setShowPortal(false);
    setSplitPage(false);
  };

  return (
    <Form {...form}>
      <InputCard
        title="Grocery List Helper"
        onClick={handleInputClose}
        content={
          <div className={`flex flex-col gap-6 mt-2 ${isMobile ? "" : ""}`}>
            <p className="!text-lg bg-primary text-white p-4 rounded-lg w-[100%]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
              Nulla quis sem at nibh elementum imperdiet. Duis sagittis
            </p>
            <p className="!text-lg bg-gray-100 p-4 rounded-lg w-[80%] ml-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
              Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum.
              Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris
              massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti
              sociosqu ad
            </p>
          </div>
        }
        footer={
          <div className="flex flex-row gap-4 items-center justify-center">
            <Input
              className="!text-lg h-12 bg-gray-100"
              placeholder="Lets Talk Food..."
            />
            <Button
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              className="btn-primary rounded-full w-12 h-12 hover:bg-gray-500"
              data-testid="send-button"
            >
              <Icons.send className="!w-8 !h-8" />
            </Button>
          </div>
        }
      />
    </Form>
  );
}
