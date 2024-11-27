"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/images/logo_current.png";

export default function Home() {
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
      </div>
      {/* Logo Section (Hidden on smaller screens) */}
      {window.innerWidth > 1024 && (
        <div className="flex w-[50%] items-center justify-center">
          <Image src={logo} width={400} height={400} alt={"Logo"} />
        </div>
      )}
    </div>
  );
}
