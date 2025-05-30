"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export const completeOnboarding = async () => {
  const { userId } = await auth();

  if (!userId) {
    return { message: "No Logged In User" };
  }

  const client = await clerkClient();

  try {
    const res = await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboardingComplete: true,
        // set the user role to "user" after onboarding is complete
        role: "user",
      },
    });
    return { message: res.publicMetadata };
  } catch (err) {
    return { error: "There was an error updating the user metadata." };
  }
};
