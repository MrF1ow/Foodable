"use client";

import PreferenceForm from "@/components/forms/PreferenceForm";
import { useFetchUserPreferences } from "@/server/hooks/userHooks";
import Spinner from "@/components/Spinner";

export default function PreferencePage() {
  const { isLoadingPreferences } = useFetchUserPreferences({
    enabled: true,
  });

  return (
    <>
      {isLoadingPreferences ? (
        <Spinner />
      ) : (
        <div className="p-6 max-w-3xl mx-auto">
          <PreferenceForm className="bg-transparent border-none shadow-none" />
        </div>
      )}
    </>
  );
}
