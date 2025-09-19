const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const path = require("path");

// 🔹 تهيئة Firebase Admin SDK
const serviceAccount = require(path.join(__dirname, "serviceAccountKey.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// -------------------------
// 1️⃣  LOGIN: التحقق من idToken
// -------------------------
app.post("/login", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "idToken is required" });
    }

    // التحقق من الـ idToken
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // البحث في Firestore عن النظارة الخاصة بالمستخدم
    // (مفترض أنك عامل Collection اسمه 'glasses' كل doc هو uid المستخدم)
    const glassDoc = await db.collection("glasses").doc(uid).get();

    if (!glassDoc.exists) {
      return res.status(404).json({ message: "No glasses linked to this user" });
    }

    const glassData = glassDoc.data();

    res.json({
      message: "Login successful",
      uid: uid,
      glassId: glassData.glassId || null,
      glassData: glassData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login error", error: error.message });
  }
});

// -------------------------
// 2️⃣ SET LANGUAGE: حفظ اللغة
// -------------------------
let lastMessage = ""; // تخزين آخر رسالة

app.post("/set-language", (req, res) => {
  const { lang } = req.body;

  if (!lang) {
    return res.status(400).json({ message: "Please send a 'lang' field in JSON" });
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

// -------------------------
// 3️⃣ GET MESSAGE: عرض آخر رسالة
// -------------------------
app.get("/get-message", (req, res) => {
  if (lastMessage) {
    res.json({ message: lastMessage });
  } else {
    res.json({ message: "لم يتم إرسال أي رسالة بعد" });
  }
});

// -------------------------
// تشغيل السيرفر
// -------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
