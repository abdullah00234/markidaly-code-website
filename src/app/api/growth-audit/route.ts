import { NextResponse } from "next/server";
import { Resend } from "resend";

// Request-size and field-length limits. The form itself only exposes a
// handful of short fields and one free-text message — these caps exist to
// bound the cost of each Resend send and block abuse, not to accommodate
// legitimate large input.
const MAX_BODY_BYTES = 10_000;
const MAX_SHORT_FIELD_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_LIST_ITEMS = 20;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ErrorBody = { error: string };

function errorResponse(message: string, status: number) {
  return NextResponse.json<ErrorBody>({ error: message }, { status });
}

function isNonEmptyShortString(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= MAX_SHORT_FIELD_LENGTH
  );
}

function sanitizeStringList(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length > MAX_LIST_ITEMS) return null;
  const items = value.map((item) => (typeof item === "string" ? item.trim() : null));
  if (items.some((item) => !item || item.length > MAX_SHORT_FIELD_LENGTH)) return null;
  return items as string[];
}

// Requires RESEND_API_KEY and GROWTH_AUDIT_TO_EMAIL to be set — see
// .env.example. Without them this route intentionally fails loudly rather
// than silently dropping a real lead.
//
// Request-count abuse (and the Resend cost that comes with it) is throttled
// upstream at Netlify's edge — see the /api/growth-audit rate-limit rule in
// netlify.toml. Validation here is defense-in-depth: it bounds payload size
// and shape regardless of where the request came from.
export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.GROWTH_AUDIT_TO_EMAIL;

  if (!apiKey || !toEmail) {
    console.error(
      "Growth audit form: RESEND_API_KEY or GROWTH_AUDIT_TO_EMAIL is not configured."
    );
    return errorResponse("Form is not yet configured. Please try again later.", 500);
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return errorResponse("Unsupported content type.", 415);
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return errorResponse("Request body too large.", 413);
  }

  const rawBody = await request.text();
  if (rawBody.length > MAX_BODY_BYTES) {
    return errorResponse("Request body too large.", 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return errorResponse("Malformed JSON.", 400);
  }

  if (typeof body !== "object" || body === null) {
    return errorResponse("Invalid request body.", 400);
  }

  const { name, email, company, website, revenueRange, helpNeeded, markets, message } =
    body as Record<string, unknown>;

  if (
    !isNonEmptyShortString(name) ||
    !isNonEmptyShortString(email) ||
    !isNonEmptyShortString(company) ||
    !isNonEmptyShortString(website) ||
    !isNonEmptyShortString(revenueRange)
  ) {
    return errorResponse("Missing or invalid required fields.", 400);
  }

  if (!EMAIL_PATTERN.test(email.trim())) {
    return errorResponse("Please provide a valid email address.", 400);
  }

  if (
    typeof message !== "undefined" &&
    message !== null &&
    message !== "" &&
    (typeof message !== "string" || message.length > MAX_MESSAGE_LENGTH)
  ) {
    return errorResponse("Message is too long.", 400);
  }

  const sanitizedHelpNeeded = helpNeeded == null ? [] : sanitizeStringList(helpNeeded);
  const sanitizedMarkets = markets == null ? [] : sanitizeStringList(markets);
  if (sanitizedHelpNeeded === null || sanitizedMarkets === null) {
    return errorResponse("Invalid selection data.", 400);
  }

  const safeName = name.trim();
  const safeEmail = email.trim();
  const safeCompany = company.trim();
  const safeWebsite = website.trim();
  const safeRevenueRange = revenueRange.trim();
  const safeMessage = typeof message === "string" ? message.trim() : "";

  const lines = [
    `Name: ${safeName}`,
    `Work Email: ${safeEmail}`,
    `Company / Brand: ${safeCompany}`,
    `Website / Amazon Store URL: ${safeWebsite}`,
    `Monthly Amazon Revenue Range: ${safeRevenueRange}`,
    `Needs help with: ${sanitizedHelpNeeded.length ? sanitizedHelpNeeded.join(", ") : "—"}`,
    `Target market(s): ${sanitizedMarkets.length ? sanitizedMarkets.join(", ") : "—"}`,
    "",
    "Message:",
    safeMessage || "(none)",
  ];

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: process.env.GROWTH_AUDIT_FROM_EMAIL || "Markidly Growth Audit <onboarding@resend.dev>",
      to: toEmail,
      replyTo: safeEmail,
      subject: `New Growth Audit request — ${safeCompany}`,
      text: lines.join("\n"),
    });

    if (error) {
      console.error("Growth audit form: Resend error", error);
      return errorResponse("Failed to send. Please try again later.", 502);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Growth audit form: unexpected error", err);
    return errorResponse("Failed to send. Please try again later.", 500);
  }
}
