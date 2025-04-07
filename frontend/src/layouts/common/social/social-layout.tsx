interface SocialLayoutProps {
  profileBanner: React.ReactNode;
  children: React.ReactNode;
}
export default function SocialLayout({
  profileBanner,
  children,
}: SocialLayoutProps) {
  return (
    <div className="flex flex-col lg:grid lg:grid-rows-[45%_55%] w-full h-full bg-background gap-y-6">
      <div className="h-full w-full">{profileBanner}</div>
      <div className="flex-1 h-full">{children}</div>
    </div>
  );
}
