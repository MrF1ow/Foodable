import MainLayout from "@/layouts/main";
import ContentLayout from "@/layouts/content";

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
