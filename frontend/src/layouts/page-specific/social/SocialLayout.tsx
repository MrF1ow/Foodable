import SocialPageHeader from "@/components/page-specific/social/SocialPageHeader"

interface SocialLayoutProps {
  children: React.ReactNode;
  userDetails: any;
}
export default function SocialLayout({
  children,
  userDetails,
}: SocialLayoutProps) {
  return (
    <div className="flex flex-col w-full h-full bg-background gap-y-2 md:gap-y-4 lg:gap-y-6">
      <div className="h-[45%] w-full"><SocialPageHeader userDetails={userDetails} /></div>
      <div className="h-[55%] w-full">{children}</div>
    </div>
  );
}
