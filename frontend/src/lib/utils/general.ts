export const capitalizeTitle = (str: string) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const getIndexOfItemInArray = (itemToFind: any, items: any[]) => {
  return items.findIndex((item) => item === itemToFind);
};
