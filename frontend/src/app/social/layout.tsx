import MainLayout from "@/layouts/common/main";
import ContentLayout from "@/layouts/common/content";
import SocialLayout from "@/layouts/common/social/social-layout";
import { SocialPageHeader } from "@/components/common/social/social-page-headers";
import userBanner from "../../../public/images/user_banner.jpg";

export default function SettingsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout>
      <ContentLayout
        mainContent={
          <SocialLayout
            profileBanner={<SocialPageHeader bannerUrl={userBanner.src} />}
          >
            {children}
          </SocialLayout>
        }
      />
    </MainLayout>
  );
}
