import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthOptions() {
  return (
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
  );
}
