import { ReactNode } from "react";
import { ClientSideContentLayout } from "./client-side-content";

interface ContentLayoutProps {
  split?: boolean;
  mainContent: ReactNode;
  subContent?: ReactNode;
}

export default function ContentLayout({
  split = false,
  mainContent,
  subContent,
}: ContentLayoutProps) {
  return (
    <ClientSideContentLayout
      split={split}
      mainContent={mainContent}
      subContent={subContent}
    />
  );
}
