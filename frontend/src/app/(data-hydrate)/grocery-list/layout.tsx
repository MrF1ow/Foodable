import MainLayout from "@/layouts/main";
import ContentLayout from "@/layouts/content";
import { MainGroceryHeader } from "@/components/page-specific/grocery/GroceryHeaders";

export default function GroceryListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout headerComponent={<MainGroceryHeader />}>
      <ContentLayout mainContent={children} />
    </MainLayout>
  );
}
