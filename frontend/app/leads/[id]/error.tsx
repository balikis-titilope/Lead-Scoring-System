"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function LeadDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Dashboard
      </Link>
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="p-3 rounded-full bg-red-500/15">
          <AlertCircle className="h-6 w-6 text-red-400" />
        </div>
        <h2 className="text-lg font-semibold text-white">Failed to load lead details</h2>
        <p className="text-sm text-gray-400 max-w-sm">
          {error.message || "An unexpected error occurred while fetching this lead."}
        </p>
        <button
          onClick={reset}
          className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-md transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
