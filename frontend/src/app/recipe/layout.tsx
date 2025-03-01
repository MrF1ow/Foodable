import MainLayout from "@/layouts/common/main";
import ContentLayout from "@/layouts/common/content";
import RecipeSearchBar from "@/components/common/recipe/recipe-search-bar";
import { SideList } from "@/components/common/side-list";

export default function GroceryListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout headerComponent={<RecipeSearchBar />}>
      <ContentLayout split mainContent={children} subContent={<SideList />} />
    </MainLayout>
  );
}
