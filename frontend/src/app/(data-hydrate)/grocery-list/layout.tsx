import MainLayout from "@/layouts/common/main";
import ContentLayout from "@/layouts/common/content";
import RightSideCard from "@/components/common/grocery/gorcery-right-side-card";
import GroceryListHeader from "@/components/common/grocery/grocery-list-header";

export default function GroceryListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout headerComponent={<GroceryListHeader />}>
      <ContentLayout mainContent={children} subContent={<RightSideCard />} />
    </MainLayout>
  );
}
