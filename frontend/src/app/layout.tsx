import type { Metadata } from "next";

import { Providers } from "@/providers/default";
import "./globals.css";

export const metadata: Metadata = {
  title: "Foodable",
  description: "Making Food More Doable",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="w-screen h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
