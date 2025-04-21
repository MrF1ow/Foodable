import { Roles } from "@/types/global";
import { auth, currentUser } from "@clerk/nextjs/server";

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
