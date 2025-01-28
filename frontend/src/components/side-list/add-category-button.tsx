"use client";

// Package Imports
import { IoMdAddCircle } from "react-icons/io";
import { useState } from "react";

// Local Imports
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // Using Dialog components
import { Input } from "@/components/ui/input"; // Assuming Input component exists
import { Button } from "@/components/ui/button"; // Assuming Button component exists
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"; // Assuming Accordion components are available

// Helper function to simulate adding category (could be updated to use context or props for real application)
const addNewCategory = (
  category: string,
  setCategories: React.Dispatch<React.SetStateAction<string[]>>
) => {
  setCategories((prevCategories) => [...prevCategories, category]);
};

export const AddCategoryButton = () => {
  const [categoryTitle, setCategoryTitle] = useState("");
  const [categories, setCategories] = useState<string[]>([]); // To store created categories

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryTitle(e.target.value);
  };

  const handleFormSubmit = () => {
    if (categoryTitle.trim()) {
      addNewCategory(categoryTitle, setCategories);
      setCategoryTitle(""); // Clear input after creating category
    } else {
      alert("Category title cannot be empty!");
    }
  };

  return (
    <div className="relative">
      <Dialog>
        <DialogTrigger asChild>
          <IoMdAddCircle size={60} className="text-primary cursor-pointer" />
        </DialogTrigger>

        <DialogContent className="w-64 bg-black p-6 rounded-lg text-white">
          <DialogHeader>
            <DialogTitle>Create a New Category</DialogTitle>
            <DialogDescription>
              Please enter a name for your new category.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="text"
            value={categoryTitle}
            onChange={handleCategoryChange}
            placeholder="Category Name"
            className="mb-4"
          />
          <div className="flex justify-between">
            <DialogClose asChild>
              <Button
                onClick={() => setCategoryTitle("")}
                className="bg-gray-300 hover:bg-gray-400 text-black"
              >
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                onClick={handleFormSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Create
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      {categories.length > 0 && (
        <Accordion
          type="multiple"
          className="mt-4 rounded-md shadow-md shadow-gray-500" // Removed border and set gray shadow
        >
          {categories.map((category, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="w-full" // Removed border
            >
              <AccordionTrigger
                className="text-black pl-6 text-3xl font-semibold hover:text-primary focus:text-primary transition-all" // Larger font size, black text, left padding increased, and hover/focus effect
              >
                {category}
                <span className="radix-accordion-trigger-arrow h-6 w-6 ml-4 text-black transition-transform duration-300 transform hover:rotate-180" />
              </AccordionTrigger>
              <AccordionContent className="text-black bg-background p-4 rounded-md shadow-md mt-2">
                <div className="p-4">Content for {category}</div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};