export const FORM_NAMES = {
    CREATE_RECIPE: "createRecipe",
    RECIPE: "recipe",
    GROCERY_LIST: 'groceryList',
}

export type FormName = typeof FORM_NAMES[keyof typeof FORM_NAMES];