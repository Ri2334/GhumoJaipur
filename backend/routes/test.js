import { getTestData, postTestData } from "../controllers/testController.js";
import { isEmailConfigured, sendEmailViaApi } from "../utils/mailer.js";

import express from "express";

const router = express.Router();

// GET route - retrieve test data
router.get("/", getTestData);

// POST route - create test data
router.post("/", postTestData);

// Health check for mailer REST API
router.get("/mail-check", async (req, res) => {
  if (!isEmailConfigured()) {
    return res.status(500).json({ 
      success: false, 
      message: "Brevo API is NOT configured. Please add BREVO_API_KEY to Render environment variables." 
    });
  }

  try {
    // Send a minimal test email to the configured sender address to verify API Key
    const result = await sendEmailViaApi({
      to: process.env.MAIL_USER || "acd8d8001@smtp-brevo.com",
      subject: "Ghumo Jaipur - API Health Check",
      html: "<p>API Connection Test Successful. The transactional email service is ready.</p>"
    });

    if (result.sent) {
      return res.json({ 
        success: true, 
        message: "Brevo API verified successfully. The system can send emails.",
        messageId: result.messageId
      });
    } else {
      return res.status(500).json({ 
        success: false, 
        message: `Brevo API Verification Failed: ${result.reason}` 
      });
    }
  } catch (error) {
    console.error("API Verification Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: `API Verification Failed: ${error.message}` 
    });
  }
});

export default router;
