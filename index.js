// index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

let lastMessage = ""; // لتخزين آخر رسالة

// GET /
app.get("/", (req, res) => {
  res.send("✅ Server is running on Railway. Use POST /set-language to send language.");
});

// POST /set-language
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

// GET /get-language
app.get("/get-language", (req, res) => {
  if (lastMessage) {
    res.json({ language: lastMessage });
  } else {
    res.json({ message: "لم يتم إرسال أي لغة بعد" });
  }
});

// Railway uses dynamic port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
