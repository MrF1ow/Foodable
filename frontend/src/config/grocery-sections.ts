import React from "react";

import {
  BakeryIcon,
  DairyIcon,
  ProduceIcon,
  MeatIcon,
  PantryIcon,
  FrozenIcon,
  SnacksIcon,
  BeveragesIcon,
  BabyIcon,
  HouseholdIcon,
  SeafoodIcon,
  PersonalCareIcon,
  PetIcon,
  AlchoholIcon,
  SweetsIcon,
} from "@/assets/icons/grocery-sections";
import { GrocerySection } from "@/types/grocery";

export const grocerySections: GrocerySection[] = [
  {
    title: "Bakery",
    Icon: BakeryIcon,
    color: "#FF9500",
  },
  {
    title: "Dairy",
    Icon: DairyIcon,
    color: "#007AFF",
  },
  {
    title: "Produce",
    Icon: ProduceIcon,
    color: "#34C759",
  },
  {
    title: "Meat",
    Icon: MeatIcon,
    color: "#FF3D00",
  },
  {
    title: "Pantry",
    Icon: PantryIcon,
    color: "#b87635",
  },
  {
    title: "Frozen",
    Icon: FrozenIcon,
    color: "#8FC1D1",
  },
  {
    title: "Snacks",
    Icon: SnacksIcon,
    color: "#cf157e",
  },
  {
    title: "Beverages",
    Icon: BeveragesIcon,
    color: "#008080",
  },
  {
    title: "Baby",
    Icon: BabyIcon,
    color: "#4B0082",
  },
  {
    title: "Household",
    Icon: HouseholdIcon,
    color: "#AF52DE",
  },
  {
    title: "Seafood",
    Icon: SeafoodIcon,
    color: "#00bfff",
  },
  {
    title: "Personal Care",
    Icon: PersonalCareIcon,
    color: "#A52A2A",
  },
  {
    title: "Pet",
    Icon: PetIcon,
    color: "#000000",
  },
  {
    title: "Alcohol",
    Icon: AlchoholIcon,
    color: "#FF007F",
  },
  {
    title: "Sweets",
    Icon: SweetsIcon,
    color: "#8A2BE2",
  },
];
