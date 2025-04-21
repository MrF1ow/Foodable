export interface KrogerProduct {
  productId: string;
  description: string;
  brand?: string;
  categories?: string[];
  images?: {
    perspective: string;
    sizes: { url: string }[];
  }[];
  items?: {
    size?: string;
  }[];
}
