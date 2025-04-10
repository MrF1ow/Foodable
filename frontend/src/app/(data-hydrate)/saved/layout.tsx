import MainLayout from "@/layouts/common/main";
import ContentLayout from "@/layouts/common/content";
import { GeneralHeader } from "@/components/general-header";

export default function SavedItemsLayout({
  mainContent,
  subContent,
}: {
  mainContent: React.ReactNode;
  subContent: React.ReactNode;
}) {
  return (
    <MainLayout
      headerComponent={<GeneralHeader title={"Saved Items"} width="25%" />}
    >
      <ContentLayout
        mainContent={mainContent}
        subContent={subContent}
      />
    </MainLayout>
  );
}
