// Sends the contact-form email, and is built not to get stuck.
//
// Providers are tried in order until one succeeds:
//   1. Resend  (RESEND_API_KEY)          — called over plain HTTPS, no SDK
//   2. SMTP    (SMTP_HOST/USER/PASS)     — e.g. a Gmail App Password
//
// Every attempt has a hard timeout, Resend gets one retry on a transient
// failure (rate limit / server error), and a provider that is not configured is
// simply skipped. So a slow, down or misconfigured provider can never hang the
// form — at worst the next one sends it, or the visitor gets a clear error with
// WhatsApp as the way through.
import nodemailer from "nodemailer";

const TIMEOUT_MS = 10000;

function withTimeout(promise, ms, label) {
  let t;
  const timeout = new Promise((_, reject) => {
    t = setTimeout(
      () => reject(new Error(`${label} timed out after ${ms} ms`)),
      ms,
    );
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(t));
}

async function viaResend(mail) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { skipped: true };
  const body = JSON.stringify({
    // Until the domain is verified in Resend, "onboarding@resend.dev" is the only
    // allowed sender, and it can only deliver to the Resend account's own email.
    from:
      process.env.CONTACT_FROM_EMAIL ||
      "Hive Akshat Website <onboarding@resend.dev>",
    to: [mail.to],
    reply_to: mail.replyTo,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
  });
  for (let attempt = 1; attempt <= 2; attempt++) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body,
        signal: controller.signal,
      });
      if (res.ok) return { ok: true };
      const detail = await res.text().catch(() => "");
      // 429 and 5xx are worth one more try; anything else (bad key, bad sender) is not.
      if ((res.status === 429 || res.status >= 500) && attempt === 1) {
        await new Promise((r) => setTimeout(r, 800));
        continue;
      }
      throw new Error(`Resend ${res.status}: ${detail.slice(0, 200)}`);
    } catch (err) {
      if (attempt === 2 || err.name !== "AbortError") throw err;
    } finally {
      clearTimeout(t);
    }
  }
  throw new Error("Resend failed");
}

async function viaSmtp(mail) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return { skipped: true };
  const port = Number(SMTP_PORT || 465);
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: TIMEOUT_MS,
    greetingTimeout: TIMEOUT_MS,
    socketTimeout: TIMEOUT_MS,
  });
  await withTimeout(
    transport.sendMail({
      from: `"Hive Akshat Website" <${SMTP_USER}>`,
      to: mail.to,
      replyTo: mail.replyTo,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    }),
    TIMEOUT_MS + 2000,
    "SMTP",
  );
  return { ok: true };
}

/**
 * Returns { ok: true, provider } on success, { ok: false, reason } otherwise.
 * Never throws and never waits longer than the providers' timeouts combined.
 */
export async function sendMail(mail) {
  const errors = [];
  let tried = 0;
  for (const [name, send] of [
    ["resend", viaResend],
    ["smtp", viaSmtp],
  ]) {
    try {
      const r = await send(mail);
      if (r.skipped) continue;
      tried++;
      return { ok: true, provider: name };
    } catch (err) {
      tried++;
      errors.push(`${name}: ${err.message}`);
      console.error(`[contact] ${name} failed —`, err.message);
    }
  }
  return {
    ok: false,
    reason: tried === 0 ? "no-provider" : errors.join(" | "),
  };
}

const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

/** The enquiry, as a plain-text + simple HTML email. */
export function enquiryEmail(e) {
  const rows = [
    ["Name", e.name],
    ["Email", e.email],
    ["Phone", e.phone],
    ["About", e.eventType],
    ["Organisation / place", e.location],
    ["Date", e.date],
  ].filter(([, v]) => v);
  const text =
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    `\n\n${e.message || "(no message)"}\n`;
  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;color:#16130f">
  <h2 style="margin:0 0 12px">New enquiry from ${esc(e.name)}</h2>
  <table cellpadding="6" style="border-collapse:collapse">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="color:#8c857a">${esc(k)}</td><td><b>${esc(v)}</b></td></tr>`,
    )
    .join("")}</table>
  <p style="white-space:pre-wrap;border-left:3px solid #f0782d;padding-left:12px">${esc(e.message || "(no message)")}</p>
  <p style="color:#8c857a;font-size:12px">Reply to this email to answer ${esc(e.name)} directly.</p>
</div>`;
  return {
    subject: `New enquiry: ${e.eventType || "Website"} — ${e.name}`,
    text,
    html,
  };
}
