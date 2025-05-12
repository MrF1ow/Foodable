"use client";

import { Button } from "@/components/ui/button";
import AuthOptions from "@/components/authentication/AuthOptions";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";

interface LandingPageProps {
  logo: StaticImageData;
}

export default function LandingPage({ logo }: LandingPageProps) {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLargeScreen(window.innerWidth > 1024);

      const handleResize = () => setIsLargeScreen(window.innerWidth > 1024);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return (
    <div className="flex w-full h-full items-center justify-between px-8 lg:px-16 font-league text-foreground">
      {/* Title and Button Section */}
      <div className="flex flex-col space-y-5 md:space-y-10 text-center w-full lg:text-left lg:w-auto">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold">Foodable</h1>
        <h2 className="text-2xl md:text-4xl lg:text-6xl">
          Making Food More Doable.
        </h2>
        <AuthOptions className="w-full text-foreground pr-4 pl-4 md:p-0" />
        <Button variant="link" asChild>
          <Link href="/recipe" data-testid="guest-choice">Continue As Guest</Link>
        </Button>
      </div>
      {/* Logo Section (Hidden on smaller screens) */}
      {isLargeScreen && (
        <div className="flex w-[50%] items-center justify-center">
          <Image src={logo} width={400} height={400} alt={"Logo"} />
        </div>
      )}
    </div>
  );
}
