export const FORM_NAMES = {
  CREATE_RECIPE: "createRecipe",
  EDIT_RECIPE: "editRecipe",
  RECIPE: "recipe",
  ADD_ITEM_TO_LIST: "addItemToList",
  FIND_PRICE: "findPrice",
  LIST_ASSISTANT: "listAssistant",
  GROCERY_LIST: "groceryList",
  FOLLOWER_POPUP: "followerPopup",
};

export type FormName = (typeof FORM_NAMES)[keyof typeof FORM_NAMES];
