import { ReactNode } from "react";
import ClientSideMainLayout from "./client-side-main";

export default function MainLayout({
  children,
  headerComponent,
}: {
  children: ReactNode;
  headerComponent?: ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen bg-background overflow-hidden">
      {/* Responsive elements go into a Client Component */}
      <ClientSideMainLayout headerComponent={headerComponent}>
        {children}
      </ClientSideMainLayout>
    </div>
  );
}
