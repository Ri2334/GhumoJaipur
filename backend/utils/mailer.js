import axios from "axios";

/**
 * Brevo REST API Configuration
 * We use the REST API instead of SMTP to bypass cloud provider port restrictions.
 */
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const getApiKey = () => process.env.BREVO_API_KEY;
const getSenderEmail = () => process.env.MAIL_USER || "acd8d8001@smtp-brevo.com";
const getSenderName = () => "Ghumo Jaipur";

/**
 * Validates if the Brevo API is configured
 */
export const isEmailConfigured = () => Boolean(getApiKey());

/**
 * Sends an email using Brevo's Transactional Email REST API
 */
export const sendEmailViaApi = async ({ to, subject, html }) => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    console.error("Mailer Error: BREVO_API_KEY is not configured.");
    return { sent: false, reason: "API Key missing" };
  }

  try {
    const payload = {
      sender: { name: getSenderName(), email: getSenderEmail() },
      to: [{ email: to }],
      subject: subject,
      htmlContent: html,
    };

    const response = await axios.post(BREVO_API_URL, payload, {
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      timeout: 10000, // 10 seconds timeout
    });

    console.log("Mailer Success: Email sent via Brevo API", response.data.messageId);
    return { sent: true, messageId: response.data.messageId };
  } catch (error) {
    const errorDetail = error.response?.data?.message || error.message;
    console.error("Mailer Error: Brevo API request failed", errorDetail);
    return { sent: false, reason: errorDetail };
  }
};

/**
 * High-level utility for OTP delivery
 */
export const sendOtpEmail = async ({ to, otp, purpose }) => {
  console.log(`Attempting to send OTP to ${to} via Brevo API for purpose: ${purpose}`);
  
  const subject = purpose === "reset-password" ? "Ghumo Jaipur password reset OTP" : "Ghumo Jaipur signup OTP";
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">
      <h2 style="color: #4f46e5; margin-bottom: 16px;">Ghumo Jaipur</h2>
      <p style="font-size: 16px;">Hello,</p>
      <p style="font-size: 16px;">Your one-time password (OTP) for <strong>${purpose.replace("-", " ")}</strong> is:</p>
      <div style="font-size: 32px; font-weight: 800; letter-spacing: 6px; padding: 16px 24px; background: #f3f4f6; display: inline-block; border-radius: 12px; margin: 16px 0; color: #111827; border: 2px solid #e5e7eb;">
        ${otp}
      </div>
      <p style="font-size: 14px; color: #6b7280; margin-top: 16px;">
        This code is valid for <strong>10 minutes</strong>. Please do not share this OTP with anyone.
      </p>
      <hr style="margin: 24px 0; border: 0; border-top: 1px solid #e5e7eb;" />
      <p style="font-size: 12px; color: #9ca3af;">
        If you didn't request this code, you can safely ignore this email.
      </p>
    </div>
  `;

  return await sendEmailViaApi({ to, subject, html });
};
