import MainLayout from "@/layouts/main";
import ContentLayout from "@/layouts/content";
import SocialLayout from "@/layouts/page-specific/social/SocialLayout";
import SocialPageHeader from "@/components/page-specific/social/SocialPageHeader";
import userBanner from "../../../../public/images/user_banner.jpg";
import { checkRole } from "@/lib/utils/roles";

export default async function SettingsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const isUser = await checkRole("user");
  return (
    <MainLayout>
      <ContentLayout
        mainContent={
          isUser ? (
            <SocialLayout
              profileBanner={<SocialPageHeader bannerUrl={userBanner.src} />}
            >
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
