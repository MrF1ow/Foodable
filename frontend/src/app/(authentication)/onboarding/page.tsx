import { checkOnboarding } from "@/lib/utils/roles";
import OnboardingComponent from "./onboarding";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {

  const complete = await checkOnboarding();

  if (complete) {
    redirect("/");
  }
  return <OnboardingComponent />;
}