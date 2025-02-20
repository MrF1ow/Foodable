import { UnitConversions, Units } from "../types";

export const unitOptions: Units[] = [
  "pcs",
  "kg",
  "g",
  "l",
  "ml",
  "tbsp",
  "tsp",
  "lb",
  "oz",
  "cup",
  "pint",
  "quart",
  "gallon",
];

export const unitsAsTuple = [
  "pcs",
  "kg",
  "g",
  "l",
  "ml",
  "tbsp",
  "tsp",
  "lb",
  "oz",
  "cup",
  "pint",
  "quart",
  "gallon",
] as const;

export const unitConversions: UnitConversions = {
  kg: {
    g: 1000,
    lb: 2.20462,
    oz: 35.274,
  },
  g: {
    kg: 0.001,
    lb: 0.00220462,
    oz: 0.035274,
  },
  lb: {
    kg: 0.453592,
    g: 453.592,
    oz: 16,
  },
  oz: {
    kg: 0.0283495,
    g: 28.3495,
    lb: 0.0625,
    cup: 0.125,
  },
  l: {
    ml: 1000,
    cup: 4.22675,
    tbsp: 67.628,
    tsp: 202.884,
    pint: 2.11338,
    quart: 1.057,
    gallon: 0.264172,
  },
  ml: {
    l: 0.001,
    cup: 0.00422675,
    tbsp: 0.067628,
    tsp: 0.202884,
    pint: 0.00211338,
    quart: 0.001057,
    gallon: 0.000264172,
  },
  cup: {
    l: 0.236588,
    ml: 236.588,
    tbsp: 16,
    tsp: 48,
    pint: 0.5,
    quart: 0.25,
    gallon: 0.0625,
    oz: 8,
  },
  tbsp: {
    l: 0.0147868,
    ml: 14.7868,
    cup: 0.0625,
    tsp: 3,
    pint: 0.03125,
    quart: 0.015625,
    gallon: 0.00390625,
  },
  tsp: {
    l: 0.00492892,
    ml: 4.92892,
    cup: 0.0208333,
    tbsp: 0.333333,
    pint: 0.0104167,
    quart: 0.00520833,
    gallon: 0.00130208,
  },
  pint: {
    l: 0.473176,
    ml: 473.176,
    cup: 2,
    tbsp: 32,
    tsp: 96,
    quart: 0.5,
    gallon: 0.125,
  },
  quart: {
    l: 0.946353,
    ml: 946.353,
    cup: 4,
    tbsp: 64,
    tsp: 192,
    pint: 2,
    gallon: 0.25,
  },
  gallon: {
    l: 3.78541,
    ml: 3785.41,
    cup: 16,
    tbsp: 256,
    tsp: 768,
    pint: 8,
    quart: 4,
  },
  pcs: {
    pcs: 1,
  },
};
