import MainLayout from "@/layouts/common/main";
import ContentLayout from "@/layouts/common/content";
import { MainGroceryHeader } from "@/components/common/grocery/GroceryHeaders";

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
