import { GroceryItem } from "@/types/grocery";
import { convertAmount, isConvertable } from "./converstions";
import { KrogerApi } from "@/server/api";


export const insertItemIntoGroceryMap = (
    item: GroceryItem,
    groceryMap: Map<string, GroceryItem>
): Map<string, GroceryItem> | null => {
    const newMap = groceryMap;
    const existingItem = groceryMap.get(item.name.toLowerCase());
    if (existingItem) {
        if (!isConvertable(item.unit, existingItem.unit)) {
            return newMap;
        }
        const convertedQuantity = convertAmount(
            item.quantity,
            item.unit,
            existingItem.unit
        );
        existingItem.quantity += convertedQuantity;
        newMap.set(item.name.toLowerCase(), existingItem);
    } else {
        newMap.set(item.name.toLowerCase(), {
            ...item,
            checked: false,
        });
    }
    return newMap;
};

export const fetchStorePricesFromGroceryMap = async (
  storeId: string,
  groceryMap: Map<string, GroceryItem>
): Promise<Map<string, number>> => {
  const priceMap = new Map<string, number>();

  for (const [key, item] of groceryMap.entries()) {
    try {
      let product;
      if (item.productId) {
        const response = await KrogerApi.fetchKrogerProductById(
          item.productId,
          storeId
        );
        product = response?.data;
      } else {
        const response = await KrogerApi.fetchKrogerProducts(
          item.name,
          storeId
        );
        if (response?.data?.length) {
          product = response.data.find((product: any) =>
            product?.items?.some(
              (item: any) => item.fulfillment?.inStore === true
            )
          );
        }
      }

      let itemWithStock;

      if (Array.isArray(product)) {
        for (const p of product) {
          itemWithStock = p.items?.find(
            (item: any) => item.fulfillment?.inStore === true
          );
          if (itemWithStock) break;
        }
      } else {
        itemWithStock = product?.items?.find(
          (item: any) => item.fulfillment?.inStore === true
        );
      }

      const price = itemWithStock?.price?.regular;

      if (price !== undefined) {
        console.log(`Fetched price for ${item.name}: ${price}`);
        priceMap.set(key, price);
      } else {
        console.log(`Price not found for ${item.productId}`, product);
      }
    } catch (error) {
      console.error(`Failed to fetch price for ${item.name} `, error);
    }
  }

  return priceMap;
};