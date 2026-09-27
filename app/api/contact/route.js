import { NextResponse } from "next/server";
import { enquiryEmail, sendMail } from "@/lib/mailer";

// nodemailer needs Node, not the Edge runtime.
export const runtime = "nodejs";

const LIMITS = {
  name: 120,
  email: 200,
  phone: 40,
  eventType: 80,
  location: 200,
  date: 40,
  message: 5000,
};

// Handles enquiry-form submissions: validate, then email them to Akshay.
// Providers and credentials live in env vars — see .env.example.
export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real people never fill this hidden field. Bots do.
  if (data.company) return NextResponse.json({ ok: true });

  // Trim and cap every field, so a bad actor cannot post a novel.
  const e = {};
  for (const [k, max] of Object.entries(LIMITS))
    e[k] = String(data[k] ?? "")
      .trim()
      .slice(0, max);

  if (!e.name || !e.email || !e.phone) {
    return NextResponse.json(
      { message: "Please fill in your name, email and phone." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email)) {
    return NextResponse.json(
      { message: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const to = process.env.CONTACT_TO_EMAIL;
  const result = to
    ? await sendMail({ to, replyTo: e.email, ...enquiryEmail(e) })
    : { ok: false, reason: "no-recipient" };

  if (result.ok) return NextResponse.json({ ok: true });

  // Nothing configured on a developer's machine: log it and let the form succeed.
  if (
    process.env.NODE_ENV !== "production" &&
    (result.reason === "no-provider" || result.reason === "no-recipient")
  ) {
    console.log("[contact] email not configured — enquiry:", e);
    return NextResponse.json({ ok: true, dev: true });
  }

  // In production a lost enquiry is worse than an error: say so, and the form
  // offers WhatsApp and email instead.
  console.error("[contact] enquiry NOT delivered:", result.reason, e);
  return NextResponse.json(
    {
      message:
        "Sorry — the message could not be sent right now. Please WhatsApp or email directly.",
      fallback: true,
    },
    { status: 502 },
  );
}
