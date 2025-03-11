"use client";

import { useFetchUserPreferences } from "@/server/hooks/userHooks";

export default function PreferencePage() {
  const { preferences, isLoadingPreferences } = useFetchUserPreferences({
    enabled: true,
  });

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4">Preferences</h1>

      <div className="flex flex-row items-center>">
        <div className="text-xl fond-semibold">Dietary Restrictions</div>
      </div>

      <div className="flex flex-row items-center>">
        <div className="text-xl fond-semibold">Budget</div>
      </div>

      <div className="space-y-4"></div>
    </div>
  );
}
