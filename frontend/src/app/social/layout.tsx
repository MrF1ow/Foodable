import MainLayout from "@/layouts/common/main";
import ContentLayout from "@/layouts/common/content";
import { GeneralHeader } from "@/components/general-header";

export default function SettingsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout
      headerComponent={<GeneralHeader title={"Social"} width="50%" />}
    >
      <ContentLayout mainContent={children} />
    </MainLayout>
  );
}
