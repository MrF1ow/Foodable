export type Units =
  | "kg"
  | "g"
  | "l"
  | "ml"
  | "pcs"
  | "tbsp"
  | "tsp"
  | "lb"
  | "oz"
  | "cup"
  | "pint"
  | "quart"
  | "gallon";

export interface UnitConversions {
  [key: string]: {
    [key in Units]?: number; // Optional number for each unit conversion
  };
}
