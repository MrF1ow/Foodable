import MainLayout from "@/layouts/main";
import ContentLayout from "@/layouts/content";
import RecipeSearchBar from "@/components/page-specific/recipe/RecipeSearchBar";

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
