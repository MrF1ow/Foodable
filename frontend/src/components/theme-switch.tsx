"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MdOutlineWbSunny } from "react-icons/md";
import { FaMoon } from "react-icons/fa";
import { useUpdateUserSettings } from "@/server/hooks/userHooks";

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  const { updateUserSettings } = useUpdateUserSettings();

  const handleThemeChange = async (newTheme: "light" | "dark") => {
    console.log("newTheme: ", newTheme);
    setTheme(newTheme);
    await updateUserSettings({ theme: newTheme });
  };

  useEffect(() => setMounted(true), []);

  if (typeof window === "undefined" || !mounted) return null;

  if (resolvedTheme === "dark") {
    return (
      <button
        onClick={() => handleThemeChange("light")}
        className="p-2 rounded-lg bg-card-background hover:bg-secondary text-foreground transition"
        aria-label="Toggle Theme"
      >
        <MdOutlineWbSunny size={24} />
      </button>
    );
  }

  if (resolvedTheme === "light") {
    return (
      <button
        onClick={() => handleThemeChange("dark")}
        className="p-2 rounded-lg bg-card-background hover:bg-secondary text-foreground transition"
        aria-label="Toggle Theme"
      >
        <FaMoon size={24} />
      </button>
    );
  }

  return null;
}
