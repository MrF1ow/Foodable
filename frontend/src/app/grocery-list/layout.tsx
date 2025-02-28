import MainLayout from "@/layouts/common/main";
import ContentLayout from "@/layouts/common/content";
import RightSideCard from "./rightSide";
import GroceryListHeader from "./header";

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
