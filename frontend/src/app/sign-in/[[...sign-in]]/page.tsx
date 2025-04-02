"use client";

import { AuthenticationLayout } from "@/layouts/common/authentication";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import SignInForm from "@/components/authentication/SignInForm";

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [clerkError, setClerkError] = useState("");
  const router = useRouter();

  const signInWithEmail = async ({
    emailAddress,
    password,
  }: {
    emailAddress: string;
    password: string;
  }) => {
    if (!isLoaded) {
      return;
    }

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });
      if (result.status === "complete") {
        console.log(result);
        await setActive({ session: result.createdSessionId });
        router.push("/recipe");
      } else {
        console.log(result);
      }
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      setClerkError(err.errors[0].message);
    }
  };
  return (
    <AuthenticationLayout>
      <SignInForm signInWithEmail={signInWithEmail} clerkError={clerkError} />
    </AuthenticationLayout>
  );
}
