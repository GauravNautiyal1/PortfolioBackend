
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Resend } = require("resend");

const app = express();
app.use(express.json());
app.use(cors());

const resend = new Resend(process.env.RESEND_API_KEY);

// POST API to receive form data
app.post("/send-message", async (req, res) => {
  const { name, email, website, message } = req.body;

  if (!name || !email || !message) {
    return res.json({
      success: false,
      message: "Please fill all required fields.",
    });
  }
  console.log("Received data:", { name, email, website, message });

  try {
    const response = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>", // or your custom domain
      to: process.env.RECEIVER_EMAIL,            // your email stored in .env
      subject: "New Contact Form Message",
      html: `
        <h2>New Portfolio Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Website:</strong> ${website || "N/A"}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    res.json({
      success: true,
      message: "Message sent successfully!",
      data: response,
    });
  } catch (error) {
    console.error("Email error:", error);
    res.json({
      success: false,
      message: "Failed to send message",
      error,
    });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
