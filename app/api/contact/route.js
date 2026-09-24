import { NextResponse } from "next/server";

// Handles enquiry-form submissions.
// Right now it validates the data and logs it, so the form works locally with no setup.
// The commented blocks show exactly where to plug in email (Resend) and a database later.
export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const { name, email, phone, eventType, date, message, company } = data;

  // Honeypot: real people never fill this hidden field. Bots do.
  if (company) {
    return NextResponse.json({ ok: true }); // silently ignore spam
  }

  // Basic validation
  if (!name || !email || !phone) {
    return NextResponse.json({ message: "Please fill in your name, email and phone." }, { status: 400 });
  }
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
  }

  // For now, just log the enquiry so you can see it in your terminal.
  console.log("New enquiry:", { name, email, phone, eventType, date, message });

  // ---- 1) SAVE TO DATABASE (optional) --------------------------------------
  // Example with a Postgres client / Supabase — install and configure first.
  // await db.insert("enquiries", { name, email, phone, eventType, date, message });

  // ---- 2) SEND EMAIL TO AKSHAT (optional) ----------------------------------
  // Example with Resend (https://resend.com):
  //
  // import { Resend } from "resend";           // put at top of file
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: "Website <query@hiveakshat.com>",
  //   to: process.env.CONTACT_TO_EMAIL,
  //   subject: `New enquiry from ${name}`,
  //   text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nEvent: ${eventType}\nDate: ${date}\n\n${message}`,
  // });
  // --------------------------------------------------------------------------

  return NextResponse.json({ ok: true });
}
