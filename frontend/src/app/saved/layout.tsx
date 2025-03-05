import MainLayout from "@/layouts/common/main";
import ContentLayout from "@/layouts/common/content";
import { GeneralHeader } from "@/components/general-header";

export default function SavedItemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout
      headerComponent={<GeneralHeader title={"Saved Items"} width="25%" />}
    >
      <ContentLayout split mainContent={children} subContent={<SideList />} />
    </MainLayout>
  );
}
