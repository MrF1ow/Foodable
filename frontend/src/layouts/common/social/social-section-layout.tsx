"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function SocialSectionLayout({
  headerComponent,
  children,
}: {
  headerComponent: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="w-full h-full bg-card-background p-6 shadow-lg">
      <CardHeader className="pb-4">{headerComponent}</CardHeader>
      <CardContent className="flex flex-col gap-4 overflow-auto">
        {children}
      </CardContent>
    </Card>
  );
}
