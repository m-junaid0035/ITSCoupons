// lib/sendEmail.ts
import nodemailer from "nodemailer";
import type { SendEmailOptions } from "@/types/email";

export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com", // default to Gmail
      port: Number(process.env.SMTP_PORT) || 465,      // 465 for SSL
      secure: true,                                    // SSL must be true for 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // allows self-signed certs, useful for dev
      },
    });
    const info = await transporter.sendMail({
      from: `"ITSCoupons Contact" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent:", info.messageId);

    return { success: true };
  } catch (error: any) {
    console.error("Email sending error:", error);
    return { success: false, error: error.message || "Unknown error" };
  }
}
