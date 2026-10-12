// ชั้นข้อมูล: Firebase Authentication + Cloud Firestore + อัปโหลดสื่อผ่าน Cloudinary
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInAnonymously, signInWithEmailAndPassword, signOut,
  EmailAuthProvider, reauthenticateWithCredential, updatePassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, doc, getDoc, getDocs, setDoc, deleteDoc, collection, writeBatch,
  onSnapshot, increment, serverTimestamp, query, limit
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig, ADMIN_EMAIL, cloudinary } from "./config.js";

export const configured = !/^ใส่/.test(firebaseConfig.apiKey || "ใส่") && !!firebaseConfig.projectId;
export const uploadsConfigured = !/^ใส่/.test(cloudinary.cloudName || "ใส่") && !/^ใส่/.test(cloudinary.uploadPreset || "ใส่");

let app, auth, db;
if (configured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export function emailFor(username) {
  const u = String(username || "").trim();
  if (u.includes("@")) return u;
  return u + "@" + ADMIN_EMAIL.split("@")[1];
}
const isAdminUser = (u) => !!u && !u.isAnonymous && (u.email || "").toLowerCase() === ADMIN_EMAIL.toLowerCase();

/* ---------- auth ---------- */
// cb({ admin: boolean, uid: string|null, email: string|null })
export function watchAuth(cb) {
  if (!configured) { cb({ admin: false, uid: null }); return () => {}; }
  return onAuthStateChanged(auth, (u) => {
    if (!u) {
      // ผู้เข้าชมทั่วไปจะได้บัญชีแบบไม่ระบุตัวตน เพื่อนับสถิติการเข้าชม
      signInAnonymously(auth).catch(() => cb({ admin: false, uid: null }));
      return;
    }
    cb({ admin: isAdminUser(u), uid: u.uid, email: u.email || null, anonymous: u.isAnonymous });
  });
}
export async function login(username, password) {
  const cred = await signInWithEmailAndPassword(auth, emailFor(username), password);
  if (!isAdminUser(cred.user)) { await signOut(auth); throw { code: "not-admin" }; }
  return cred.user;
}
export function logout() { return signOut(auth); }
export async function changePassword(oldPw, newPw) {
  const u = auth.currentUser;
  await reauthenticateWithCredential(u, EmailAuthProvider.credential(u.email, oldPw));
  await updatePassword(u, newPw);
}

/* ---------- site content ---------- */
export async function loadSite() {
  const [settings, about, cats, works] = await Promise.all([
    getDoc(doc(db, "site", "settings")),
    getDoc(doc(db, "site", "about")),
    getDocs(collection(db, "categories")),
    getDocs(collection(db, "works"))
  ]);
  return {
    settings: settings.exists() ? settings.data() : null,
    about: about.exists() ? about.data() : null,
    categories: cats.docs.map((d) => ({ ...d.data(), id: d.id })),
    works: works.docs.map((d) => ({ ...d.data(), id: d.id }))
  };
}
const clean = (o) => JSON.parse(JSON.stringify(o));
export function saveSettings(s) { return setDoc(doc(db, "site", "settings"), clean(s)); }
export function saveAbout(a) { return setDoc(doc(db, "site", "about"), clean(a)); }
export function saveWork(w) { const { id, ...rest } = w; return setDoc(doc(db, "works", id), clean(rest)); }
export function removeWork(id) { return deleteDoc(doc(db, "works", id)); }
export function saveCategory(c) { const { id, ...rest } = c; return setDoc(doc(db, "categories", id), clean(rest)); }
export async function removeCategory(id, moveWorks) {
  const b = writeBatch(db);
  b.delete(doc(db, "categories", id));
  moveWorks.forEach((w) => { const { id: wid, ...rest } = w; b.set(doc(db, "works", wid), clean(rest)); });
  await b.commit();
}
export async function saveCategoryOrder(cats) {
  const b = writeBatch(db);
  cats.forEach((c) => { const { id, ...rest } = c; b.set(doc(db, "categories", id), clean(rest)); });
  await b.commit();
}
export async function seed(settings, about, cats) {
  const b = writeBatch(db);
  b.set(doc(db, "site", "settings"), clean(settings));
  b.set(doc(db, "site", "about"), clean(about));
  cats.forEach((c) => { const { id, ...rest } = c; b.set(doc(db, "categories", id), clean(rest)); });
  await b.commit();
}

/* ---------- visitor statistics ---------- */
const dkey = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
// kind: "visit" | "page" | "work"
export function track(uid, kind, key) {
  if (!configured || !uid) return Promise.resolve();
  const data = { last: serverTimestamp() };
  if (kind === "visit") { data.visits = increment(1); data.days = { [dkey(new Date())]: increment(1) }; }
  if (kind === "page") data.pages = { [key]: increment(1) };
  if (kind === "work") data.works = { [key]: increment(1) };
  return setDoc(doc(db, "visits", uid), data, { merge: true }).catch(() => {});
}
// cb(list of visitor docs) — สำหรับแดชบอร์ดของผู้ดูแลเท่านั้น
export function watchVisits(cb, onErr) {
  return onSnapshot(query(collection(db, "visits"), limit(2000)), (snap) => {
    cb(snap.docs.map((d) => {
      const v = d.data();
      return { ...v, last: v.last && v.last.toDate ? v.last.toDate().toISOString() : "" };
    }));
  }, onErr);
}

/* ---------- uploads (Cloudinary) ---------- */
// คืนค่า { url, type: "image"|"video", width, height }
export function upload(fileOrBlob, onProgress) {
  return new Promise((resolve, reject) => {
    if (!uploadsConfigured) { reject({ code: "uploads-not-configured" }); return; }
    const fd = new FormData();
    fd.append("file", fileOrBlob);
    fd.append("upload_preset", cloudinary.uploadPreset);
    fd.append("folder", "nextgen-jittipat");
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.cloudinary.com/v1_1/" + encodeURIComponent(cloudinary.cloudName) + "/auto/upload");
    xhr.upload.onprogress = (e) => { if (e.lengthComputable && onProgress) onProgress(e.loaded / e.total); };
    xhr.onload = () => {
      let r = {}; try { r = JSON.parse(xhr.responseText); } catch (e) {}
      if (xhr.status >= 200 && xhr.status < 300 && r.secure_url) resolve({ url: r.secure_url, type: r.resource_type === "video" ? "video" : "image", width: r.width || 0, height: r.height || 0 });
      else reject({ code: "upload-failed", message: (r.error && r.error.message) || ("HTTP " + xhr.status) });
    };
    xhr.onerror = () => reject({ code: "upload-failed", message: "network" });
    xhr.send(fd);
  });
}
// ภาพหน้าปกจากวิดีโอ Cloudinary (เฟรมที่วินาทีที่ 1)
export function videoPosterUrl(url) {
  if (!/res\.cloudinary\.com/.test(url)) return "";
  return url.replace("/upload/", "/upload/so_1,w_1280,c_limit/").replace(/\.[a-z0-9]+$/i, ".jpg");
}
