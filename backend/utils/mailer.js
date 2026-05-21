import nodemailer from "nodemailer";

const getMailPass = () => (process.env.MAIL_PASS || "").replace(/\s+/g, "");

const hasSmtpConfig = () => Boolean(process.env.MAIL_HOST && process.env.MAIL_USER && getMailPass());

export const createTransport = () => {
  if (!hasSmtpConfig()) return null;

  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 587),
    secure: String(process.env.MAIL_SECURE || "false") === "true",
    auth: {
      user: process.env.MAIL_USER,
      pass: getMailPass(),
    },
  });
};

export const sendOtpEmail = async ({ to, otp, purpose }) => {
  const transport = createTransport();
  if (!transport) {
    return { sent: false, reason: "SMTP not configured" };
  }

  const subject = purpose === "reset-password" ? "Ghumo Jaipur password reset OTP" : "Ghumo Jaipur signup OTP";
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin-bottom: 12px;">Ghumo Jaipur</h2>
      <p>Your one-time password is:</p>
      <div style="font-size: 28px; font-weight: 700; letter-spacing: 4px; padding: 12px 16px; background: #f3f4f6; display: inline-block; border-radius: 8px;">${otp}</div>
      <p style="margin-top: 16px;">This code expires in 10 minutes.</p>
    </div>
  `;

  await transport.sendMail({
    from: process.env.MAIL_FROM || `Ghumo Jaipur <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });

  return { sent: true };
};
