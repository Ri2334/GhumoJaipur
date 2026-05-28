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

  // Ensure sender exactly matches the verified email in Brevo
  const senderEmail = process.env.MAIL_USER;
  if (!senderEmail) {
    console.error("Mailer Error: MAIL_USER is missing. Must be a verified Brevo sender.");
    return { sent: false, reason: "Sender email missing" };
  }

  try {
    const payload = {
      sender: {
        name: "Ghumo Jaipur",
        email: senderEmail
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: html
    };

    console.log(`\n--- Brevo API Request ---`);
    console.log(`To: ${to}`);
    console.log(`Payload:`, JSON.stringify({ ...payload, htmlContent: "[HTML CONTENT OMITTED]" }, null, 2));
    console.log(`Waiting for response...\n`);

    const response = await axios.post(BREVO_API_URL, payload, {
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      timeout: 15000, // 15 seconds timeout
    });

    console.log(`\n--- Brevo API Response ---`);
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Data:`, JSON.stringify(response.data, null, 2));
    console.log(`--------------------------\n`);

    return { sent: true, messageId: response.data.messageId };
  } catch (error) {
    console.log(`\n--- Brevo API Error ---`);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data:`, JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(`Error:`, error.message);
    }
    console.log(`-----------------------\n`);
    
    const errorDetail = error.response?.data?.message || error.message;
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
