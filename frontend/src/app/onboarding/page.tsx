"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "./_actions";
import { AuthenticationLayout } from "@/layouts/common/authentication";
import { Authentication } from "svix/dist/api/authentication";

export default function OnboardingComponent() {
  const [error, setError] = React.useState("");
  const { user } = useUser();
  const router = useRouter();

  const handleSubmit = async () => {
    const res = await completeOnboarding();
    if (res?.message) {
      // Reloads the user's data from the Clerk API
      await user?.reload();
      router.push("/");
    }
    if (res?.error) {
      setError(res?.error);
    }
  };

  // this is for the user to use so they can fill out their information and preferences
  return (
    <AuthenticationLayout>
      <form action={handleSubmit}>
        {error && <p className="text-red-600">Error: {error}</p>}
        <button type="submit">Submit</button>
      </form>
    </AuthenticationLayout>
  );
}
