"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "./_actions";
import { AuthenticationLayout } from "@/layouts/common/authentication";

export default function OnboardingComponent() {
  const [error, setError] = React.useState("");
  const { user } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    const handleOnboarding = async () => {
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

    handleOnboarding();
  }, [user, router]);

  // this is for the user to use so they can fill out their information and preferences (later)
  return (
    <AuthenticationLayout>
      {error && <p className="text-red-600">Error: {error}</p>}
    </AuthenticationLayout>
  );
}
