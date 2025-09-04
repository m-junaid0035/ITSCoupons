// app/actions/contactActions.ts
"use server";

import { sendEmail } from "@/lib/sendEmail";
import type { SettingData } from "@/types/setting";

interface ContactFormInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export async function sendContactEmail(
  form: ContactFormInput,
  latestSetting: SettingData | null
) {
  const receiver = latestSetting?.contactEmail || process.env.CONTACT_RECEIVER;

  const result = await sendEmail({
    to: receiver!,
    subject: form.subject || "New Contact Form Submission",
    text: `Name: ${form.name}\nEmail: ${form.email}\nSubject: ${
      form.subject || "-"
    }\nMessage: ${form.message}`,
    html: `
      <div style="max-width:600px;margin:auto;padding:20px;
        font-family:Arial,Helvetica,sans-serif;
        border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;">
        
        <h2 style="color:#111827;text-align:center;margin-bottom:20px;">
          📩 New Contact Message
        </h2>

        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;font-weight:bold;color:#374151;">Name:</td>
            <td style="padding:8px 0;color:#111827;">${form.name}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-weight:bold;color:#374151;">Email:</td>
            <td style="padding:8px 0;color:#111827;">
              <a href="mailto:${form.email}" style="color:#2563eb;text-decoration:none;">
                ${form.email}
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-weight:bold;color:#374151;">Subject:</td>
            <td style="padding:8px 0;color:#111827;">${form.subject || "-"}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-weight:bold;color:#374151;vertical-align:top;">Message:</td>
            <td style="padding:8px 0;color:#111827;white-space:pre-line;">
              ${form.message}
            </td>
          </tr>
        </table>

        <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;" />

        <p style="font-size:12px;color:#6b7280;text-align:center;">
          This message was sent from your website contact form.
        </p>
      </div>
    `,
  });

  return result;
}
