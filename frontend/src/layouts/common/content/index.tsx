import { ReactNode } from "react";
import { ClientSideContentLayout } from "./client-side-content";

interface ContentLayoutProps {
  split?: boolean;
  mainContent: ReactNode;
}

export default function ContentLayout({
  split = false,
  mainContent,
}: ContentLayoutProps) {
  return (
    <ClientSideContentLayout
      split={split}
      mainContent={mainContent}
    />
  );
}
