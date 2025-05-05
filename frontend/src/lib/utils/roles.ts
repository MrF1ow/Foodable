import { Roles } from "@/types/global";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const checkRole = async (role: Roles) => {
  const { sessionClaims } = await auth();
  return sessionClaims?.metadata.role === role;
};

export const checkOnboarding = async () => {
  const { sessionClaims } = await auth();
  return !!sessionClaims?.metadata.onboardingComplete;
};

export const checkSession = async () => {
  const { sessionClaims } = await auth();
  return !!sessionClaims;
}

export const getUserDetails = async () => {
  const user = await currentUser();
  const userName = user?.username
  const userPfp = user?.imageUrl
  return { userName, userPfp };
}

export const getClerkUserId = async () => {
  const clerkUser = await currentUser();

  if (!clerkUser || !clerkUser.id) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return clerkUser.id;
}
