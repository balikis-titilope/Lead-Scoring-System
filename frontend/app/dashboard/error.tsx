"use client";

import { AlertCircle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="p-3 rounded-full bg-red-500/15">
          <AlertCircle className="h-6 w-6 text-red-400" />
        </div>
        <h2 className="text-lg font-semibold text-white">Failed to load dashboard</h2>
        <p className="text-sm text-gray-400 max-w-sm">
          {error.message.includes("fetch")
            ? "Could not connect to the backend. Make sure the Express server is running on port 4000."
            : error.message}
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
