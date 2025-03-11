"use client";

import { useTheme } from "next-themes";
import { useUpdateUserSettings } from "@/server/hooks/userHooks";

export default function ApplicationPage() {
  const { theme, setTheme } = useTheme();

  const { updateUserSettings } = useUpdateUserSettings();

  const handleThemeChange = async (newTheme: "light" | "dark") => {
    console.log("newTheme: ", newTheme);
    setTheme(newTheme);
    await updateUserSettings({ theme: newTheme });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4">Application Settings</h1>

      <div className="space-y-4 w-full">
        <div className="flex flex-row items-center w-full justify-between">
          <div className="text-xl fond-semibold">Theme</div>
          <div className="flex flex-row items-center space-x-4">
            <button
              onClick={() => handleThemeChange("light")}
              className={`${
                theme === "light"
                  ? "bg-primary text-foreground"
                  : "text-primary border-2 border-primary"
              } px-4 py-2 rounded-md`}
            >
              Light
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              className={`${
                theme === "dark"
                  ? "bg-primary text-foreground"
                  : "text-primary border-2 border-primary"
              } px-4 py-2 rounded-md`}
            >
              Dark
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
