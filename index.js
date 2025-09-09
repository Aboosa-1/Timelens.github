// index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

let lastMessage = ""; // لتخزين آخر رسالة

// GET / → رسالة تأكيد أن السيرفر شغال
app.get("/", (req, res) => {
  res.send("✅ Server is running. Use POST /set-language to send language.");
});

// POST /set-language → استقبال اللغة من Flutter
app.post("/set-language", (req, res) => {
  const { lang } = req.body;

  if (!lang) {
    return res.status(400).json({ message: "Please send a 'lang' field in JSON" });
  }

  // هنا نطبع اللغة في التيرمنال
  if (lang === "ar") {
    console.log("🟢 المستخدم اختار اللغة العربية");
  } else if (lang === "en") {
    console.log("🔵 User selected English");
  } else {
    console.log("⚠️ لغة غير مدعومة:", lang);
  }

  lastMessage = lang; // تخزين آخر رسالة
  res.json({ message: `تم استقبال اللغة: ${lang}` });
});

// GET /get-message → عرض آخر رسالة
app.get("/get-message", (req, res) => {
  if (lastMessage) {
    res.json({ message: lastMessage });
  } else {
    res.json({ message: "لم يتم إرسال أي رسالة بعد" });
  }
});

// تشغيل السيرفر على البورت 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
