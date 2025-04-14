import { ReactNode } from "react";
import MainLayout from "./MainLayout";

export default async function MainLayoutComponent({
  children,
  headerComponent,
}: {
  children: ReactNode;
  headerComponent?: ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen bg-background overflow-hidden">
      {/* Responsive elements go into a Client Component */}
      <MainLayout headerComponent={headerComponent}>
        {children}
      </MainLayout>
    </div>
  );
}
