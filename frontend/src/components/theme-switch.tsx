"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MdOutlineWbSunny } from "react-icons/md";
import { FaMoon } from "react-icons/fa";

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (typeof window === "undefined" || !mounted) return null;

  if (resolvedTheme === "dark") {
    return (
      <button
        onClick={() => setTheme("light")}
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
        onClick={() => setTheme("dark")}
        className="p-2 rounded-lg bg-card-background hover:bg-secondary text-foreground transition"
        aria-label="Toggle Theme"
      >
        <FaMoon size={24} />
      </button>
    );
  }

  return null;
}
