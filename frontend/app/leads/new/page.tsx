"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createLead } from "@/lib/api";

type FormState = "idle" | "submitting" | "done";

export default function NewLeadPage() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  function validate(data: FormData) {
    const errs: Record<string, string> = {};
    const name = data.get("name")?.toString().trim();
    const company = data.get("company")?.toString().trim();
    const email = data.get("email")?.toString().trim();
    const message = data.get("message")?.toString().trim();

    if (!name) errs.name = "Name is required.";
    if (!company) errs.company = "Company is required.";
    if (!email) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Enter a valid email address.";
    }
    if (!message) errs.message = "Message is required.";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const errs = validate(data);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setFormState("submitting");

    try {
      await createLead({
        name: data.get("name")!.toString().trim(),
        company: data.get("company")!.toString().trim(),
        email: data.get("email")!.toString().trim(),
        website: data.get("website")?.toString().trim() || undefined,
        message: data.get("message")!.toString().trim(),
      });
      setFormState("done");
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      setServerError(err instanceof Error ? err.message : "Failed to create lead");
      setFormState("idle");
    }
  }

  const isSubmitting = formState === "submitting";

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Submit a Lead</h1>
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1">
          Add a new lead to the system for analysis and scoring.
        </p>
      </div>

      <Card className="bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white text-base">Lead Information</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
            Fill in what you know about this lead. The more detail in the message, the better the AI qualification.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {serverError && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs sm:text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
            {/* Name + Company row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Sarah Johnson"
                  disabled={isSubmitting}
                  className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="company" className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium">
                  Company <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company"
                  name="company"
                  placeholder="Acme Software"
                  disabled={isSubmitting}
                  className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
                {errors.company && <p className="text-xs text-red-500">{errors.company}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="sarah@acmesoftware.com"
                disabled={isSubmitting}
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Website */}
            <div className="space-y-1.5">
              <Label htmlFor="website" className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium">
                Website <span className="text-gray-400 font-normal text-xs">(optional)</span>
              </Label>
              <Input
                id="website"
                name="website"
                type="url"
                placeholder="https://acmesoftware.com"
                disabled={isSubmitting}
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <Label htmlFor="message" className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium">
                Lead Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Describe the lead's needs, pain points, team size, timeline, etc."
                disabled={isSubmitting}
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-indigo-500 focus:ring-indigo-500 resize-none text-sm"
              />
              {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg shadow-sm shadow-indigo-600/20 disabled:opacity-70 transition-all text-sm cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting & Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Submit Lead
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
