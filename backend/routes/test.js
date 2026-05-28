import { getTestData, postTestData } from "../controllers/testController.js";
import { createTransport } from "../utils/mailer.js";

import express from "express";

const router = express.Router();

// GET route - retrieve test data
router.get("/", getTestData);

// POST route - create test data
router.post("/", postTestData);

// Health check for mailer
router.get("/mail-check", async (req, res) => {
  const transport = createTransport();
  if (!transport) {
    return res.status(500).json({ 
      success: false, 
      message: "SMTP is NOT configured correctly. Check MAIL_HOST, MAIL_USER, and MAIL_PASS environment variables." 
    });
  }

  try {
    // Verify connection configuration
    await transport.verify();
    return res.json({ 
      success: true, 
      message: "SMTP connection verified successfully. Transporter is ready to send emails.",
      config: {
        host: process.env.MAIL_HOST,
        user: process.env.MAIL_USER,
        port: process.env.MAIL_PORT || 587
      }
    });
  } catch (error) {
    console.error("SMTP Verification Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: `SMTP Verification Failed: ${error.message}` 
    });
  }
});

export default router;
