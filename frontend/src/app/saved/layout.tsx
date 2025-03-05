import MainLayout from "@/layouts/common/main";
import ContentLayout from "@/layouts/common/content";
import { GeneralHeader } from "@/components/general-header";
import SavedItemsRightSide from "@/components/common/saved/saved-items-right-side";

export default function SavedItemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout
      headerComponent={<GeneralHeader title={"Saved Items"} width="25%" />}
    >
      <ContentLayout
        split
        mainContent={children}
        subContent={<SavedItemsRightSide />}
      />
    </MainLayout>
  );
}
