// ตั้งค่าเว็บไซต์ — แก้ไฟล์นี้ไฟล์เดียวตามขั้นตอนใน README.md

// 1) คัดลอกค่าจาก Firebase Console > Project settings > Your apps > SDK setup and configuration (Config)
export const firebaseConfig = {
  apiKey: "AIzaSyAXt7yM16KjnkllcMmFtUiDO92_uNQQT30",
  authDomain: "nextgen-jittipat.firebaseapp.com",
  projectId: "nextgen-jittipat",
  storageBucket: "nextgen-jittipat.firebasestorage.app",
  messagingSenderId: "568129660175",
  appId: "1:568129660175:web:760df77906cf6d5f338a7a"
};

// 2) อีเมลของบัญชีผู้ดูแล (ต้องตรงกับที่สร้างใน Firebase Authentication และใน firestore.rules)
//    ตอนเข้าสู่ระบบพิมพ์แค่ "jittipat_admin" ได้เลย ระบบจะเติมส่วนหลัง @ ให้เอง
export const ADMIN_EMAIL = "jittipat_admin@nextgen-jittipat.web";

// 3) ค่าจาก Cloudinary สำหรับอัปโหลดรูปและวิดีโอ
export const cloudinary = {
  cloudName: "vxlbwzco",
  uploadPreset: "nextgen_upload"
};
