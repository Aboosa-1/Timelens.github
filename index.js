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
    return res
      .status(400)
      .json({ message: "Please send a 'lang' field in JSON" });
  }

  if (lang === "ar") {
    console.log("🟢 المستخدم اختار اللغة العربية");
  } else if (lang === "en") {
    console.log("🔵 User selected English");
  } else {
    console.log("⚠️ لغة غير مدعومة:", lang);
  }

  lastMessage = lang;
  res.json({ message: `تم استقبال اللغة: ${lang}` });
});

// GET /get-language → عرض آخر لغة
app.get("/get-language", (req, res) => {
  if (lastMessage) {
    res.json({ language: lastMessage });
  } else {
    res.json({ message: "لم يتم إرسال أي لغة بعد" });
  }
});

// تشغيل السيرفر على البورت 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
