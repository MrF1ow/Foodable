import React, { useEffect, useState } from "react";
import { MdOutlineWbSunny } from "react-icons/md";
import { FaMoon } from "react-icons/fa";

export const ThemeSwitch = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // On mount, check the user's current theme preference
    const currentTheme = document.documentElement.classList.contains("dark");
    setIsDark(currentTheme);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDark(!isDark);
  };
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-card-background hover:bg-secondary text-foreground transition"
      aria-label="Toggle Theme"
    >
      {isDark ? <MdOutlineWbSunny size={24} /> : <FaMoon size={24} />}
    </button>
  );
};
