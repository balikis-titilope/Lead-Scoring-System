"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Activity,
  Zap,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads/new", label: "New Lead", icon: PlusCircle },
  { href: "/activity", label: "Activity", icon: Activity },
];

export function Nav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navContent = (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200">
      {/* Logo & Close on mobile */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-800">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-gray-900 dark:text-white text-base tracking-wide"
        >
          <div className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-sm">
            <Zap className="h-4 w-4" />
          </div>
          <span>LeadScore AI</span>
        </Link>
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden p-1.5 rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20 font-semibold"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer controls & Status */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
        <ThemeToggle />
        <div className="pt-2 border-t border-gray-100 dark:border-gray-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              AI Engine Online
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-mono">v1.0</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top App Bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-gray-900 dark:text-white text-sm">
          <div className="p-1 rounded-md bg-indigo-600 text-white">
            <Zap className="h-3.5 w-3.5" />
          </div>
          <span>LeadScore AI</span>
        </Link>
        <div className="w-8" /> {/* Balance spacer */}
      </header>

      {/* Mobile Overlay & Slide Drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-all duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />

        {/* Sliding Panel */}
        <div
          className={cn(
            "relative w-72 max-w-[85vw] h-full shadow-2xl transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {navContent}
        </div>
      </div>

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 min-h-screen">
        <div className="sticky top-0 h-screen">
          {navContent}
        </div>
      </aside>
    </>
  );
}
