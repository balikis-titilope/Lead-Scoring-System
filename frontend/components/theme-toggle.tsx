"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-full rounded-lg bg-gray-100 dark:bg-gray-800/40 animate-pulse border border-gray-200 dark:border-gray-700" />
    );
  }

  const isDark = resolvedTheme === "dark" || theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700/80 border border-gray-200 dark:border-gray-700 transition-all w-full justify-between cursor-pointer shadow-sm"
    >
      <span className="flex items-center gap-2">
        {isDark ? (
          <Moon className="h-4 w-4 text-indigo-400" />
        ) : (
          <Sun className="h-4 w-4 text-amber-500" />
        )}
        <span className="font-semibold">{isDark ? "Dark Theme" : "Light Theme"}</span>
      </span>
      <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
}
