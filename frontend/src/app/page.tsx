"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logoWithShadow from "../../public/images/logo_current.png";
import logoNoShadow from "../../public/images/logo_current_no_shadow.png";

export default function Home() {
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [logo, setLogo] = useState(logoWithShadow);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLargeScreen(window.innerWidth > 1024);

      const handleResize = () => setIsLargeScreen(window.innerWidth > 1024);
      window.addEventListener("resize", handleResize);

      const updateLogo = () => {
        const isDarkMode = document.documentElement.classList.contains("dark");
        setLogo(isDarkMode ? logoNoShadow : logoWithShadow);
      };

      updateLogo();

      const observer = new MutationObserver(updateLogo);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      return () => {
        window.removeEventListener("resize", handleResize);
        observer.disconnect();
      };
    }
  }, []);

  return (
    <div className="flex w-full h-full items-center justify-between px-8 lg:px-16 font-league text-foreground">
      {/* Title and Button Section */}
      <div className="flex flex-col space-y-10 text-center w-full md:text-left md:w-auto">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold">Foodable</h1>
        <h2 className="text-2xl md:text-4xl lg:text-6xl">
          Making Food More Doable.
        </h2>
        <div className="w-full flex flex-row items-center justify-evenly md:justify-between text-foreground">
          <Button
            asChild
            className="w-[40%] md:w-[45%] text-xl md:text-2xl font-bold py-4 md:py-6 text-foreground"
          >
            <Link href="/sign-in">Login</Link>
          </Button>
          <Button
            asChild
            className="w-[40%] md:w-[45%] text-xl md:text-2xl font-bold py-4 md:py-6 text-foreground"
          >
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>
        <Button variant="link" asChild>
          <Link href="/recipe">Continue As Guest</Link>
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
