import "server-only";
import { getLook } from "@/content/looks";
import { site, whatsappLink } from "@/content/site";
import { FITS, OCCASIONS, labelFor, type BookingInput } from "./booking";

/**
 * Email through Resend's HTTP API (free tier: 3,000 emails / month).
 * Env: RESEND_API_KEY, BOOKING_TO_EMAIL (her inbox), EMAIL_FROM (verified sender).
 * Without a verified domain, EMAIL_FROM can stay "onboarding@resend.dev", which
 * only delivers to the Resend account owner, so the client confirmation is skipped.
 */

export type Attachment = { filename: string; content: string };

export function hasEmail() {
  return Boolean(process.env.RESEND_API_KEY && process.env.BOOKING_TO_EMAIL);
}

const FROM = () => process.env.EMAIL_FROM ?? "Olivet Apparel <onboarding@resend.dev>";

async function send(payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function shell(inner: string) {
  return `<!doctype html><html><body style="margin:0;background:#050505;font-family:Georgia,serif;color:#f3ece0">
  <div style="max-width:560px;margin:0 auto;padding:40px 28px">
    <p style="letter-spacing:6px;font-size:12px;color:#d3952f;margin:0 0 28px">OLIVET APPAREL</p>
    ${inner}
    <p style="margin-top:40px;font-size:12px;color:#a69e90">Olivet Apparel · ${esc(site.city)}</p>
  </div></body></html>`;
}

function row(k: string, v: string | null | undefined) {
  if (!v) return "";
  return `<tr><td style="padding:10px 0;border-bottom:1px solid #2a2418;color:#d3952f;font-size:12px;letter-spacing:2px;text-transform:uppercase;width:140px;vertical-align:top">${esc(k)}</td><td style="padding:10px 0;border-bottom:1px solid #2a2418;font-size:15px">${esc(v)}</td></tr>`;
}

export async function sendBookingEmails(ref: string, b: BookingInput, brief: string, attachments: Attachment[]) {
  const looks = b.looks.map((s) => getLook(s)?.title ?? s).join(", ");
  const phoneDigits = b.phone.replace(/\D/g, "").replace(/^0/, "234");
  const replyWa = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(`Hello ${b.fullName.split(" ")[0]}, thank you for booking with Olivet Apparel (${ref}) ✨`)}`;

  const designerHtml = shell(`
    <h1 style="font-weight:normal;font-size:30px;margin:0">New booking: ${esc(b.fullName)}</h1>
    <p style="color:#a69e90;margin:8px 0 24px">${esc(labelFor(OCCASIONS, b.occasion))}${b.eventDate ? ` · ${esc(b.eventDate)}` : ""} · Ref ${esc(ref)}</p>
    <p><a href="${replyWa}" style="display:inline-block;background:#d3952f;color:#120c02;text-decoration:none;padding:12px 22px;border-radius:999px;font-family:Arial,sans-serif;font-size:13px;letter-spacing:1px">REPLY ON WHATSAPP</a></p>
    <table style="width:100%;border-collapse:collapse;margin-top:20px">
      ${row("Phone", b.phone)}${row("Email", b.email)}${row("Prefers", b.preferredContact)}
      ${row("Looks", looks)}${row("Fit", labelFor(FITS, b.fit))}
      ${row("Measurements", b.measurements ? Object.entries(b.measurements).map(([k, v]) => `${k}: ${v}`).join(" · ") : null)}
      ${row("Delivery", b.delivery)}${row("Budget", b.budget)}
      ${row("Style Finder", b.style?.replaceAll("|", ", "))}${row("Notes", b.notes)}
      ${row("Photos", attachments.length ? `${attachments.length} inspiration photo(s) attached` : null)}
    </table>`);

  await send({
    from: FROM(),
    to: process.env.BOOKING_TO_EMAIL!.split(",").map((s) => s.trim()),
    reply_to: b.email ?? undefined,
    subject: `New booking: ${b.fullName} · ${labelFor(OCCASIONS, b.occasion)}${b.eventDate ? ` · ${b.eventDate}` : ""}`,
    html: designerHtml,
    text: brief,
    attachments: attachments.length ? attachments : undefined,
  });

  const canEmailClient = b.email && !FROM().includes("resend.dev");
  if (canEmailClient) {
    await send({
      from: FROM(),
      to: [b.email],
      reply_to: process.env.BOOKING_TO_EMAIL!.split(",")[0].trim(),
      subject: `We've received your request · ${ref}`,
      html: shell(`
        <h1 style="font-weight:normal;font-size:30px;margin:0">Thank you, ${esc(b.fullName.split(" ")[0])}.</h1>
        <p style="font-size:16px;line-height:1.6;color:#d8d0c2">Your request has reached the atelier. We'll be in touch within one working day to plan your consultation.</p>
        <p style="font-size:14px;color:#a69e90">Your reference: <strong style="color:#fada81">${esc(ref)}</strong></p>
        ${looks ? `<p style="font-size:14px;color:#a69e90">Looks you chose: ${esc(looks)}</p>` : ""}
        <p><a href="${whatsappLink(`Hello Olivet Apparel ✨ my booking reference is ${ref}.`)}" style="color:#fada81">Message us on WhatsApp</a></p>`),
      text: `Thank you, ${b.fullName}. Your request (${ref}) has reached Olivet Apparel. We'll be in touch within one working day.`,
    });
  }
}
