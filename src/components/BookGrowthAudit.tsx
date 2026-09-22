"use client";

import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import Eyebrow from "./ui/Eyebrow";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { EASE_PREMIUM } from "@/lib/motion";

const REVENUE_RANGES = [
  "Under $400K",
  "$400K – $1M",
  "$1M – $5M",
  "$5M – $15M",
  "$15M+",
  "Not sure yet",
];

const HELP_OPTIONS = [
  "Account Management",
  "PPC",
  "Listing Optimization & CRO",
  "Storefront & Brand Experience",
  "Product Launch",
  "Inventory & Account Health",
  "Marketplace Expansion",
  "Not sure yet",
];

const MARKET_OPTIONS = ["US", "UK", "Europe", "Canada", "Australia", "Other"];

const TIMELINE_OPTIONS = ["Immediately", "Within 1 month", "Within 3 months", "Just exploring"];

type Status = "idle" | "submitting" | "success" | "error";

type FieldErrors = {
  name?: string;
  email?: string;
  company?: string;
  website?: string;
  revenueRange?: string;
  helpNeeded?: string;
  markets?: string;
  timeline?: string;
};

function toggleValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function BookGrowthAudit() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [revenueRange, setRevenueRange] = useState("");
  const [helpNeeded, setHelpNeeded] = useState<string[]>([]);
  const [markets, setMarkets] = useState<string[]>([]);
  const [timeline, setTimeline] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  function clearError(field: keyof FieldErrors) {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "Please enter your name.";
    if (!email.trim()) next.email = "Please enter your work email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Please enter a valid email.";
    if (!company.trim()) next.company = "Please enter your company or brand.";
    if (!website.trim()) next.website = "Please enter your website or Amazon store URL.";
    if (!revenueRange) next.revenueRange = "Please select a revenue range.";
    if (helpNeeded.length === 0) next.helpNeeded = "Please select at least one option.";
    if (markets.length === 0) next.markets = "Please select at least one market.";
    if (!timeline) next.timeline = "Please select a timeline.";
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    setSubmitError("");

    try {
      const res = await fetch("/api/growth-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          website,
          revenueRange,
          helpNeeded,
          markets,
          timeline,
          message,
        }),
      });

      if (!res.ok) throw new Error("request-failed");

      setStatus("success");
    } catch {
      setStatus("error");
      setSubmitError("Something went wrong sending your request. Please try again, or email us directly.");
    }
  }

  if (status === "success") {
    return (
      <section id="book-audit" className="bg-white py-24 lg:py-32">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: EASE_PREMIUM }}
            className="mx-auto max-w-lg rounded-[28px] border border-line bg-bg p-10 text-center sm:p-14"
          >
            <h2 className="font-[family-name:var(--font-heading)] text-[26px] font-bold text-navy sm:text-[30px]">
              Request received.
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-ink-soft">
              A founder will personally review your account and follow up within one
              business day with next steps for your growth audit.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="book-audit" className="bg-white py-24 lg:py-32">
      <div className="container-page">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: EASE_PREMIUM }}
            className="lg:self-start lg:sticky lg:top-28"
          >
            <Eyebrow>Get Started</Eyebrow>
            <h2 className="font-[family-name:var(--font-heading)] text-[30px] font-extrabold leading-[1.15] tracking-tight text-navy sm:text-[36px]">
              Book Your Free Growth Audit
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-soft">
              Markidly is a founder-led Amazon growth and account management
              team for established brands. Sameer and Abu Bakar stay hands-on
              across every account, working alongside a team of specialists in
              advertising, listings, inventory, and operations.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: EASE_PREMIUM, delay: 0.1 }}
            onSubmit={handleSubmit}
            noValidate
            className="rounded-[28px] border border-line bg-bg p-6 sm:p-8 lg:p-10"
          >
            <FieldGroup>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <FieldContent>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        clearError("name");
                      }}
                    />
                    <FieldError>{errors.name}</FieldError>
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Work Email</FieldLabel>
                  <FieldContent>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearError("email");
                      }}
                    />
                    <FieldError>{errors.email}</FieldError>
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="company">Company / Brand</FieldLabel>
                  <FieldContent>
                    <Input
                      id="company"
                      value={company}
                      onChange={(e) => {
                        setCompany(e.target.value);
                        clearError("company");
                      }}
                    />
                    <FieldError>{errors.company}</FieldError>
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel htmlFor="website">Website / Amazon Store URL</FieldLabel>
                  <FieldContent>
                    <Input
                      id="website"
                      value={website}
                      onChange={(e) => {
                        setWebsite(e.target.value);
                        clearError("website");
                      }}
                    />
                    <FieldError>{errors.website}</FieldError>
                  </FieldContent>
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="revenue">Monthly Amazon Revenue Range</FieldLabel>
                <FieldContent>
                  <select
                    id="revenue"
                    value={revenueRange}
                    onChange={(e) => {
                      setRevenueRange(e.target.value);
                      clearError("revenueRange");
                    }}
                    className="h-12 w-full rounded-xl border border-line bg-white px-4 text-[15px] text-navy transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="" disabled>
                      Select a range
                    </option>
                    {REVENUE_RANGES.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                  <FieldError>{errors.revenueRange}</FieldError>
                </FieldContent>
              </Field>

              <FieldSet>
                <FieldLegend>What do you need help with?</FieldLegend>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {HELP_OPTIONS.map((option) => (
                    <Field key={option} className="flex-row items-center gap-2.5">
                      <Checkbox
                        id={`help-${option}`}
                        checked={helpNeeded.includes(option)}
                        onCheckedChange={() => {
                          setHelpNeeded((prev) => toggleValue(prev, option));
                          clearError("helpNeeded");
                        }}
                      />
                      <FieldLabel htmlFor={`help-${option}`} className="font-normal">
                        {option}
                      </FieldLabel>
                    </Field>
                  ))}
                </div>
                <FieldError>{errors.helpNeeded}</FieldError>
              </FieldSet>

              <FieldSet>
                <FieldLegend>Target Market(s)</FieldLegend>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {MARKET_OPTIONS.map((option) => (
                    <Field key={option} className="flex-row items-center gap-2.5">
                      <Checkbox
                        id={`market-${option}`}
                        checked={markets.includes(option)}
                        onCheckedChange={() => {
                          setMarkets((prev) => toggleValue(prev, option));
                          clearError("markets");
                        }}
                      />
                      <FieldLabel htmlFor={`market-${option}`} className="font-normal">
                        {option}
                      </FieldLabel>
                    </Field>
                  ))}
                </div>
                <FieldError>{errors.markets}</FieldError>
              </FieldSet>

              <FieldSet>
                <FieldLegend>Timeline</FieldLegend>
                <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Timeline">
                  {TIMELINE_OPTIONS.map((option) => {
                    const isActive = timeline === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => {
                          setTimeline(option);
                          clearError("timeline");
                        }}
                        className={`rounded-full border px-4 py-2 text-[13.5px] font-medium transition-colors duration-200 ${
                          isActive
                            ? "border-primary bg-primary text-white"
                            : "border-line bg-white text-ink-soft hover:border-primary/40 hover:text-primary"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                <FieldError>{errors.timeline}</FieldError>
              </FieldSet>

              <Field>
                <FieldLabel htmlFor="message">Message</FieldLabel>
                <FieldContent>
                  <Textarea
                    id="message"
                    placeholder="Anything else we should know? (optional)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </FieldContent>
              </Field>

              <div>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex w-full items-center justify-center rounded-full bg-gradient-brand px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_1px_2px_rgba(11,31,58,0.08),0_10px_24px_-8px_rgba(31,94,255,0.5)] transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {status === "submitting" ? "Sending…" : "Book My Growth Audit"}
                </button>
                <FieldError className="mt-4">{submitError}</FieldError>
                <FieldDescription className="mt-4">
                  No pitch deck. No generic report. Just a clear read on your
                  account and what we&rsquo;d do first.
                </FieldDescription>
              </div>
            </FieldGroup>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
