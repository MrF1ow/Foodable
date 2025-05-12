import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthOptions({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 ${className}`} data-testid='auth-options'>
      <Button
        asChild
        className="w-full md:w-[45%] text-xl md:text-2xl font-bold py-4 md:py-6 text-foreground"
      >
        <Link href="/sign-in">Login</Link>
      </Button>
      <Button
        asChild
        className="w-full md:w-[45%] text-xl md:text-2xl font-bold py-4 md:py-6 text-foreground"
      >
        <Link href="/sign-up">Sign Up</Link>
      </Button>
    </div>
  );
}

export const NotUserOptions = () => {
  return (
    <div className="flex flex-col w-full h-full items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">To Access this Page Please Do One of the Following</h1>
      <AuthOptions className="w-[50%]" />
    </div>
  )
}
