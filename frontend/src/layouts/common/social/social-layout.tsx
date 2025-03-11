interface SocialLayoutProps {
  profileBanner: React.ReactNode;
  children: React.ReactNode;
}
export default function SocialLayout({
  profileBanner,
  children,
}: SocialLayoutProps) {
  return (
    <div className="grid grid-rows-[45%_55%] w-full h-full bg-background p-6 gap-y-6">
      <div className="h-full">{profileBanner}</div>
      <div className="flex-1 h-full">{children}</div>
    </div>
  );
}
