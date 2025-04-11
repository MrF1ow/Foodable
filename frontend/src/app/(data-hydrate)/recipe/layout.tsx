import MainLayout from "@/layouts/common/main";
import ContentLayout from "@/layouts/common/content";
import RecipeSearchBar from "@/components/common/recipe/recipe-search-bar";

export default function RecipeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout headerComponent={<RecipeSearchBar />}>
      <ContentLayout
        split
        mainContent={children}
      />
    </MainLayout>
  );
}
