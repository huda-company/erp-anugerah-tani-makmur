import nodemailer from "nodemailer";

import {
  SMTP_FROM,
  SMTP_FROM_EMAIL,
  SMTP_PASSWORD,
  SMTP_USER,
} from "^/config/env";

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `${SMTP_FROM} < ${SMTP_FROM_EMAIL}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
}
