import { checkOnboarding } from "@/lib/utils/clerk-utils";
import OnboardingForm from "./onboarding";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {

  const complete = await checkOnboarding();

  if (complete) {
    redirect("/grocery-list");
  }
  return <OnboardingForm />;
}