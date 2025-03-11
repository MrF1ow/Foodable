import MainLayout from "@/layouts/common/main";
import ContentLayout from "@/layouts/common/content";

export default function SettingsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout>
      <ContentLayout mainContent={children} />
    </MainLayout>
  );
}
