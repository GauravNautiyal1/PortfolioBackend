const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// POST API to receive form data
app.post("/send-message", async (req, res) => {
  const { name, email, website, message } = req.body;

  if (!name || !email || !message) {
    return res.json({ success: false, message: "Please fill all required fields......" });
  }

  try {
    // Setup email transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL,
      subject: "New Contact Form Message",
      text: `
      Name: ${name}
      Email: ${email}
      Website: ${website}
      Message: ${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to send message" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
