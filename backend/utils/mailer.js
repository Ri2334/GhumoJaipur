import nodemailer from "nodemailer";

const getMailPass = () => (process.env.MAIL_PASS || "").replace(/\s+/g, "");

const hasSmtpConfig = () => Boolean(process.env.MAIL_HOST && process.env.MAIL_USER && getMailPass());

export const createTransport = () => {
  if (!hasSmtpConfig()) return null;

  const port = Number(process.env.MAIL_PORT || 587);
  const isGmail = (process.env.MAIL_HOST || "").toLowerCase().includes("gmail");
  
  // For Gmail on 587, secure must be false. On 465, it must be true.
  const secure = port === 465;

  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: port,
    secure: secure,
    auth: {
      user: process.env.MAIL_USER,
      pass: getMailPass(),
    },
    tls: {
      // Do not fail on invalid certificates (useful for some SMTP relays)
      rejectUnauthorized: false
    }
  });
};

export const sendOtpEmail = async ({ to, otp, purpose }) => {
  console.log(`Attempting to send OTP to ${to} for purpose: ${purpose}`);
  const transport = createTransport();
  if (!transport) {
    console.error("Mailer Error: SMTP Transport could not be created. Check environment variables.");
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

  try {
    const info = await transport.sendMail({
      from: process.env.MAIL_FROM || `Ghumo Jaipur <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Mailer Success: Email sent successfully", info.messageId);
    return { sent: true };
  } catch (error) {
    console.error("Mailer Error: Failed to send email", error);
    return { sent: false, reason: error.message };
  }
};
