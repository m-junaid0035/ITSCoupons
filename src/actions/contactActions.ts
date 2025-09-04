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
    text: `Name: ${form.name}\nEmail: ${form.email}\nMessage: ${form.message}`,
    html: `
      <h3>New Contact Message</h3>
      <p><b>Name:</b> ${form.name}</p>
      <p><b>Email:</b> ${form.email}</p>
      <p><b>Subject:</b> ${form.subject || "-"}</p>
      <p><b>Message:</b><br/>${form.message}</p>
    `,
  });

  return result;
}
