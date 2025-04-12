import { ReactNode } from "react";
import ContentLayout from "./ContentLayout";

interface ContentLayoutProps {
  split?: boolean;
  mainContent: ReactNode;
}

export default async function ContentLayoutComponent({
  split = false,
  mainContent,
}: ContentLayoutProps) {
  return (
    <ContentLayout
      split={split}
      mainContent={mainContent}
    />
  );
}
