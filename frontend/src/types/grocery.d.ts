export interface GrocerySection {
  title: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: string;
  section: string;
  checked: boolean;
}
