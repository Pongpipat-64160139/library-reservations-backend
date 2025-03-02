require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5001;

app.get("/", (req, res) => {
  res.send("📩 Library Reservation Backend is running...");
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route ส่งอีเมล
app.post("/send-email", async (req, res) => {
  const { to_email, name, student_id, reason_cancel, from } = req.body;

  // ตั้งค่า SMTP
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // ตั้งค่า Subject ให้เป็น base64
  const subjectText = "แจ้งการยกเลิกการจองห้อง";
  const encodedSubject = `=?UTF-8?B?${Buffer.from(subjectText).toString("base64")}?=`;

  // เนื้อหาอีเมล (ใช้ Template)
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to_email,
    subject: encodedSubject,  // ตั้งค่า Subject ให้เป็น Base64
    text: `เรียน ${name},\n\nทาง ${from} ได้ดำเนินการยกเลิกการจองห้องของคุณ\nรหัสนิสิต: ${student_id}\nเนื่องจาก: ${reason_cancel}\n\nขออภัยในความไม่สะดวก`,  // ใช้ `text` แทน `html`
    headers: {
      "Content-Type": "text/plain; charset=UTF-8",
      "Content-Transfer-Encoding": "base64"
    }
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "✅ อีเมลส่งสำเร็จ!" });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ message: "⚠️ เกิดข้อผิดพลาดในการส่งอีเมล" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
