import { Roles } from "@/types/global";
import { auth } from "@clerk/nextjs/server";

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
