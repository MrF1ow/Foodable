import MainLayout from "@/layouts/main";
import ContentLayout from "@/layouts/content";
import GeneralHeader from "@/components/GeneralHeader";

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
        mainContent={children}
      />
    </MainLayout>
  );
}
