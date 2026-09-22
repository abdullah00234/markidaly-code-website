import { NextResponse } from "next/server";
import { Resend } from "resend";

// Requires RESEND_API_KEY and GROWTH_AUDIT_TO_EMAIL to be set — see
// .env.example. Without them this route intentionally fails loudly rather
// than silently dropping a real lead.
export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.GROWTH_AUDIT_TO_EMAIL;

  if (!apiKey || !toEmail) {
    console.error(
      "Growth audit form: RESEND_API_KEY or GROWTH_AUDIT_TO_EMAIL is not configured."
    );
    return NextResponse.json(
      { error: "Form is not yet configured. Please try again later." },
      { status: 500 }
    );
  }

  const body = await request.json();
  const { name, email, company, website, revenueRange, helpNeeded, markets, timeline, message } = body ?? {};

  if (!name || !email || !company || !website || !revenueRange) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const lines = [
    `Name: ${name}`,
    `Work Email: ${email}`,
    `Company / Brand: ${company}`,
    `Website / Amazon Store URL: ${website}`,
    `Monthly Amazon Revenue Range: ${revenueRange}`,
    `Needs help with: ${Array.isArray(helpNeeded) && helpNeeded.length ? helpNeeded.join(", ") : "—"}`,
    `Target market(s): ${Array.isArray(markets) && markets.length ? markets.join(", ") : "—"}`,
    `Timeline: ${timeline || "—"}`,
    "",
    "Message:",
    message ? String(message) : "(none)",
  ];

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: process.env.GROWTH_AUDIT_FROM_EMAIL || "Markidly Growth Audit <onboarding@resend.dev>",
      to: toEmail,
      replyTo: email,
      subject: `New Growth Audit request — ${company}`,
      text: lines.join("\n"),
    });

    if (error) {
      console.error("Growth audit form: Resend error", error);
      return NextResponse.json({ error: "Failed to send." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Growth audit form: unexpected error", err);
    return NextResponse.json({ error: "Failed to send." }, { status: 500 });
  }
}
