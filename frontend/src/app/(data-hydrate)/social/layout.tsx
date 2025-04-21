import MainLayout from "@/layouts/main";
import ContentLayout from "@/layouts/content";
import SocialLayout from "@/layouts/page-specific/social/SocialLayout";
import { checkRole, getUserDetails } from "@/lib/utils/roles";

export default async function SettingsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const isUser = await checkRole("user");
  const user = await getUserDetails();

  return (
    <MainLayout>
      <ContentLayout
        mainContent={
          isUser ? (
            <SocialLayout userDetails={user}>
              {children}
            </SocialLayout>
          ) : (
            <>{children}</>
          )
        }
      />
    </MainLayout>
  );
}
