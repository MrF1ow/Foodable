import MainLayout from "@/layouts/main";
import ContentLayout from "@/layouts/content";
import GeneralHeader from "@/components/GeneralHeader";
import { checkRole } from "@/lib/utils/roles";

export default async function SavedItemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isUser = await checkRole("user");
  return (
    <MainLayout
      headerComponent={isUser && <GeneralHeader title={"Saved Items"} width="25%" />}
    >
      <ContentLayout
        mainContent={children}
      />
    </MainLayout>
  );
}
