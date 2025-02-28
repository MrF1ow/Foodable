import { ReactNode } from "react";
import { ClientSideContentLayout } from "./client-side-content";

type ContentLayoutProps =
  | {
      mainContent: ReactNode;
      subContent: ReactNode;
    }
  | {
      mainContent: ReactNode;
      subContent?: ReactNode;
    };

export default function ContentLayout({
  mainContent,
  subContent,
}: ContentLayoutProps) {
  return (
    <ClientSideContentLayout
      mainContent={mainContent}
      subContent={subContent}
    />
  );
}
