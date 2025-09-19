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
// 1️⃣ LOGIN: التحقق من idToken + ربط النظارة
// -------------------------
app.post("/login", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "idToken is required" });
    }

    // ✅ التحقق من الـ idToken
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // ✅ البحث في Firestore عن بيانات الجهاز (النظارة + التطبيق)
    const deviceDoc = await db.collection("devices").doc(uid).get();

    if (!deviceDoc.exists) {
      return res.status(404).json({ message: "No device linked to this user" });
    }

    const deviceData = deviceDoc.data();

    res.json({
      message: "Login successful",
      uid: uid,
      glassId: deviceData.glassId || null,
      appId: deviceData.appId || null,
      deviceData: deviceData,
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
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
    console.log("⚠ لغة غير مدعومة:", lang);
  }

  lastMessage = lang;
  res.json({ message: تم استقبال اللغة: ${lang} }); // ✅ تعديل الـ string
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
  console.log(🚀 Server running on port ${PORT});
});
