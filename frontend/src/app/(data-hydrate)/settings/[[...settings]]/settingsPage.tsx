"use client";

import { UserProfile } from "@clerk/nextjs";
import TermsAndConditions from "@/components/page-specific/settings/TermsTab";
import PreferencePage from "@/components/page-specific/settings/PreferenceTab";
import ApplicationPage from "@/components/page-specific/settings/ApplicationTab";
import { Icons } from "@/components/ui/icons";
import { useGeneralStore } from "@/stores/general/store";

export default function UserProfilePage() {
  const clerkVariables = useGeneralStore((state) => state.clerkVariables);
  return (
    <UserProfile
      path="/settings"
      routing="path"
      appearance={{
        variables: clerkVariables,
        elements: {
          rootBox: "w-full h-full",
          cardBox: "w-full h-full shadow-lg border-foreground",
        },
      }}
    >
      <UserProfile.Page
        label="Settings"
        labelIcon={<Icons.dot />}
        url="application-settings"
      >
        <ApplicationPage />
      </UserProfile.Page>
      <UserProfile.Page
        label="Preferences"
        labelIcon={<Icons.dot />}
        url="user-preferences"
      >
        <PreferencePage />
      </UserProfile.Page>

      <UserProfile.Page label="Terms" labelIcon={<Icons.dot />} url="terms">
        <TermsAndConditions />
      </UserProfile.Page>
    </UserProfile>
  );
}
