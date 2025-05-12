import type { Metadata } from "next";

import Providers from "./providers";
import { ClerkProvider } from "@clerk/nextjs";
import { checkRole } from "@/lib/utils/clerk-utils";
import "./globals.css";

export const metadata: Metadata = {
  title: "Foodable",
  description: "Making Food More Doable",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isUser = await checkRole("user");
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="w-screen h-screen">
          <Providers isUser={isUser}>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
