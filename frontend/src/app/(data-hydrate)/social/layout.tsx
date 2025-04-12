import MainLayout from "@/layouts/main";
import ContentLayout from "@/layouts/content";
import SocialLayout from "@/layouts/page-specific/social/SocialLayout";
import SocialPageHeader from "@/components/page-specific/social/SocialPageHeader";
import userBanner from "../../../../public/images/user_banner.jpg";

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
