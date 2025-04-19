import MainLayout from "@/layouts/main";
import ContentLayout from "@/layouts/content";
import SaveHeader from "@/components/page-specific/saved/SaveHeader";
import { checkRole } from "@/lib/utils/roles";

export default async function SavedItemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isUser = await checkRole("user");
  return (
    <MainLayout
      headerComponent={isUser && <SaveHeader />}
    >
      <ContentLayout
        mainContent={children}
      />
    </MainLayout>
  );
}
