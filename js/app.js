// NextGen Jittipat — Digital Creative Hub & Showcase
import * as api from "./backend.js";

/* ====== helpers ====== */
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const uid = (p) => (p || "id") + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const clone = (o) => JSON.parse(JSON.stringify(o));
const store = {
  get(k, s) { try { return (s ? sessionStorage : localStorage).getItem(k); } catch (e) { return null; } },
  set(k, v, s) { try { (s ? sessionStorage : localStorage).setItem(k, v); } catch (e) {} },
  del(k, s) { try { (s ? sessionStorage : localStorage).removeItem(k); } catch (e) {} }
};
const setPath = (o, p, v) => { const ks = p.split("."); const last = ks.pop(); ks.reduce((a, k) => a[k], o)[last] = v; };
const dkey = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
const isUrl = (s) => /^https?:\/\//i.test(s || "");
function ago(iso) {
  if (!iso) return "-";
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "เมื่อสักครู่";
  if (s < 3600) return Math.floor(s / 60) + " นาทีที่แล้ว";
  if (s < 86400) return Math.floor(s / 3600) + " ชั่วโมงที่แล้ว";
  return Math.floor(s / 86400) + " วันที่แล้ว";
}
const reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
const DEFAULT_LOGO = "assets/logo.webp?v=2";

/* ====== icons ====== */
const ic = (p) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>";
const I = {
  sun: ic('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  moon: ic('<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>'),
  lock: ic('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
  play: ic('<path d="M7 4.5v15l13-7.5z" fill="currentColor" stroke="none"/>'),
  pause: ic('<path d="M7 4h3.5v16H7zM13.5 4H17v16h-3.5z" fill="currentColor" stroke="none"/>'),
  vol: ic('<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>'),
  mute: ic('<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l5 6M22 9l-5 6"/>'),
  full: ic('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'),
  film: ic('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>'),
  motion: ic('<circle cx="15" cy="12" r="5"/><path d="M3 8h5M2 12h6M3 16h5"/>'),
  palette: ic('<path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.8 1.8-1.8 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3z"/><circle cx="7.5" cy="11" r="1.2"/><circle cx="10" cy="7" r="1.2"/><circle cx="15" cy="7" r="1.2"/>'),
  code: ic('<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>'),
  spark: ic('<path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z"/><path d="M19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>'),
  image: ic('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>'),
  yt: ic('<rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="M10 9v6l5-3z" fill="currentColor"/>'),
  tt: ic('<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.5 2.6 2.4 4.3 5 4.5"/>'),
  link: ic('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
  ext: ic('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
  search: ic('<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'),
  x: ic('<path d="M6 6l12 12M18 6L6 18"/>'),
  plus: ic('<path d="M12 5v14M5 12h14"/>'),
  edit: ic('<path d="M4 20h4L19 9l-4-4L4 16z"/>'),
  trash: ic('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
  star: ic('<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>'),
  starf: ic('<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" fill="currentColor"/>'),
  up: ic('<path d="M6 15l6-6 6 6"/>'),
  down: ic('<path d="M6 9l6 6 6-6"/>'),
  left: ic('<path d="M15 5l-7 7 7 7"/>'),
  right: ic('<path d="M9 5l7 7-7 7"/>'),
  dash: ic('<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 6-7"/>'),
  grid: ic('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'),
  folder: ic('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
  user: ic('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
  gear: ic('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
  out: ic('<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l-5-5 5-5M5 12h11"/>'),
  upload: ic('<path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>'),
  copy: ic('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>'),
  save: ic('<path d="M5 3h11l5 5v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M7 3v6h9M7 21v-7h10v7"/>'),
  eye: ic('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
  zoom: ic('<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4M11 8v6M8 11h6"/>')
};
const CAT_GLYPH = { video: I.film, motion: I.motion, graphic: I.palette, code: I.code, other: I.spark };
const KIND = {
  video: { label: "วิดีโอ (อัปโหลด)", badge: "VIDEO", icon: I.play },
  youtube: { label: "YouTube", badge: "YOUTUBE", icon: I.yt },
  tiktok: { label: "TikTok", badge: "TIKTOK", icon: I.tt },
  image: { label: "รูปภาพ / กราฟิก", badge: "IMAGE", icon: I.image },
  code: { label: "โค้ด / โปรเจกต์", badge: "CODE", icon: I.code },
  link: { label: "ลิงก์ภายนอก", badge: "LINK", icon: I.link }
};
const HUES = [195, 215, 235, 258, 282, 318, 345, 20, 42, 160, 140];

/* ====== default content (used until the admin saves their own) ====== */
const DEFAULTS = {
  settings: { name: "NextGen Jittipat", eyebrow: "Digital Creative Hub & Showcase", tagline: "รวมผลงานวิดีโอ หนังสั้น โมชันกราฟิก งานกราฟิก และโปรเจกต์ไอที ที่ตั้งใจสร้างขึ้นทุกชิ้น", footer: "Digital Creative Hub & Showcase", logo: "" },
  about: {
    name: "Jittipat", role: "Video Editor · Motion Designer · IT Creator", avatar: "",
    bio: "สวัสดีครับ ผมชื่อ Jittipat ชอบเล่าเรื่องผ่านวิดีโอ โมชันกราฟิก และเทคโนโลยี\n\n(ข้อความนี้เป็นตัวอย่าง แก้ไขได้ที่ ระบบผู้ดูแล > เกี่ยวกับฉัน)",
    skills: [{ name: "ตัดต่อวิดีโอ", level: 85 }, { name: "โมชันกราฟิก", level: 75 }, { name: "ออกแบบกราฟิก", level: 70 }, { name: "เขียนโค้ด / เว็บ", level: 65 }],
    tools: ["Premiere Pro", "After Effects", "CapCut", "Photoshop", "Canva", "VS Code"],
    timeline: [{ year: "2026", title: "เปิดตัว NextGen Jittipat", detail: "รวมผลงานสายครีเอทีฟไว้ในที่เดียว" }],
    contacts: [{ label: "Email", value: "" }, { label: "YouTube", value: "" }, { label: "TikTok", value: "" }]
  },
  categories: [
    { id: "c-short", name: "วิดีโอสั้น / หนังสั้น", kind: "video", hue: 195, order: 0 },
    { id: "c-motion", name: "โมชันกราฟิก", kind: "motion", hue: 258, order: 1 },
    { id: "c-graphic", name: "งานกราฟิก", kind: "graphic", hue: 318, order: 2 },
    { id: "c-code", name: "โค้ด / โปรเจกต์", kind: "code", hue: 160, order: 3 }
  ]
};

/* ====== state ====== */
const SITE = { settings: clone(DEFAULTS.settings), about: clone(DEFAULTS.about), categories: clone(DEFAULTS.categories), works: [], seeded: false };
const S = {
  route: "home", filter: "all", q: "", atab: store.get("ngj-atab", true) || "dash",
  loaded: false, loadErr: "", authReady: false, admin: false, uid: null, email: "",
  edit: null, draft: null, saving: false, visits: null, visitsErr: "",
  newCat: { name: "", kind: "video", hue: 195 },
  viewer: null, // { id, ctx: [ids], fromClick }
  lb: null       // { list: [urls], i }
};

const catById = (id) => SITE.categories.find((c) => c.id === id) || null;
const catName = (id) => (catById(id) || {}).name || "ไม่ระบุหมวด";
const catHue = (id) => { const c = catById(id); return c ? c.hue : 210; };
const countIn = (id) => SITE.works.filter((w) => w.cat === id).length;
const workById = (id) => SITE.works.find((w) => w.id === id) || null;
const nameParts = () => { const n = (SITE.settings.name || "NextGen Jittipat").trim().split(/\s+/); return [n[0], n.slice(1).join(" ")]; };
const sortedWorks = () => SITE.works.slice().sort((a, b) => (b.created || 0) - (a.created || 0));
const logoUrl = () => SITE.settings.logo || DEFAULT_LOGO;
const sortCats = () => SITE.categories.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

/* ====== YouTube / TikTok ====== */
function ytId(u) {
  const m = String(u || "").match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/);
  return m ? m[1] : "";
}
function ttId(u) { const m = String(u || "").match(/\/video\/(\d{8,})/); return m ? m[1] : ""; }
function coverUrl(w) {
  if (w.cover) return w.cover;
  if (w.kind === "image" && w.images && w.images[0]) return w.images[0];
  if (w.kind === "youtube" && ytId(w.url)) return "https://i.ytimg.com/vi/" + ytId(w.url) + "/hqdefault.jpg";
  return "";
}

/* ====== theme ====== */
function effTheme() {
  const t = document.documentElement.getAttribute("data-theme");
  if (t) return t;
  return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function toggleTheme() {
  const next = effTheme() === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next); store.set("ngj-theme", next);
  const b = $('[data-a="theme"]'); if (b) b.innerHTML = next === "dark" ? I.sun : I.moon;
  }

/* ====== toasts, confirm, modal ====== */
function toast(msg, kind) {
  const t = document.createElement("div");
  t.className = "toast " + (kind || ""); t.innerHTML = "<i></i><div>" + esc(msg) + "</div>";
  $("#toasts").appendChild(t); setTimeout(() => t.remove(), 4500);
}
function confirmBox(msg, ok, fn) {
  openModal('<div class="mbox narrow"><div style="padding:24px;display:grid;gap:18px"><p style="font-size:17px">' + esc(msg) + '</p><div style="display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap"><button class="btn sm" data-a="close">ยกเลิก</button><button class="btn sm danger" id="cfm-ok">' + esc(ok) + "</button></div></div></div>");
  $("#cfm-ok").onclick = () => { closeModal(); fn(); };
}
function openModal(html) {
  $("#modal-root").innerHTML = '<div class="modal" data-a="backdrop">' + html + "</div>";
  document.body.style.overflow = "hidden";
}
function closeModal() {
  const m = $("#modal-root");
  $$("video", m).forEach((v) => { try { v.pause(); } catch (e) {} });
  m.innerHTML = ""; document.body.style.overflow = ""; S.edit = null; S.viewer = null;
}

/* ====== shared pieces ====== */
const imgTag = (src, alt, extra) => src ? '<img src="' + esc(src) + '" alt="' + esc(alt || "") + '" loading="lazy"' + (extra || "") + ">" : "";
const genCover = (kind, hue, big) => '<div class="gen' + (big ? " big" : "") + '" style="--h:' + hue + '">' + (KIND[kind] ? KIND[kind].icon : I.spark) + "</div>";
const coverFor = (w, big) => { const c = coverUrl(w); return c ? imgTag(c, w.title) : genCover(w.kind, catHue(w.cat), big); };

function navHtml() {
  const np = nameParts();
  const links = [["home", "หน้าแรก"], ["works", "ผลงาน"], ["about", "เกี่ยวกับฉัน"]].map((l) => '<a href="#' + l[0] + '" class="' + (S.route === l[0] ? "on" : "") + '">' + l[1] + "</a>").join("");
  return '<header class="nav wrap"><div class="nav-in glass">' +
    '<a class="brand" href="#home">' + imgTag(logoUrl(), "") + "<b>" + esc(np[0].toUpperCase()) + " <span>" + esc(np[1].toUpperCase()) + "</span></b></a>" +
    '<nav class="navlinks" aria-label="เมนูหลัก">' + links + "</nav>" +
    '<div class="navtools"><button class="iconbtn" data-a="theme" aria-label="สลับโหมดสว่างหรือมืด">' + (effTheme() === "dark" ? I.sun : I.moon) + "</button>" +
    '<a class="iconbtn" href="#admin" aria-label="ระบบผู้ดูแล" style="' + (S.route === "admin" ? "color:var(--accent);border-color:var(--accent)" : "") + '">' + I.lock + "</a></div>" +
    '</div></header><nav class="mnav" aria-label="เมนูหลัก">' + links + "</nav>";
}

function cardHtml(w, i) {
  const k = KIND[w.kind] || KIND.link;
  const playable = w.kind === "video" || w.kind === "youtube" || w.kind === "tiktok";
  return '<a class="card reveal" href="#work/' + esc(w.id) + '" data-a="open" data-id="' + esc(w.id) + '" style="--h:' + catHue(w.cat) + ";animation-delay:" + Math.min(i * 40, 240) + 'ms;text-decoration:none">' +
    '<div class="thumb">' + coverFor(w) + '<span class="badge">' + esc(k.badge) + "</span>" + (playable ? '<span class="playdot">' + I.play + "</span>" : "") + "</div>" +
    '<div class="cbody"><h3>' + esc(w.title) + '</h3><div class="cmeta"><i class="dot"></i><span>' + esc(catName(w.cat)) + "</span>" + (w.year ? '<span class="mono">' + esc(w.year) + "</span>" : "") + "</div></div></a>";
}
function emptyHtml(msg) {
  if (!S.loaded && !S.loadErr) return '<div class="empty glass"><b>กำลังโหลดผลงาน...</b><div class="loadingbar" style="width:200px"></div></div>';
  if (S.loadErr) return '<div class="empty glass">' + I.grid + "<b>โหลดผลงานไม่สำเร็จ</b><span class=\"muted\">" + esc(S.loadErr) + "</span></div>";
  return '<div class="empty glass">' + I.grid + "<b>" + esc(msg) + '</b><span class="muted">ผู้ดูแลเพิ่มผลงานได้จากเมนู ระบบผู้ดูแล &gt; ผลงาน</span></div>';
}

/* ====== pages ====== */
function homeHtml() {
  const np = nameParts(), works = sortedWorks();
  let feat = works.filter((w) => w.featured); if (!feat.length) feat = works; feat = feat.slice(0, 6);
  const facts = '<span class="fact"><b>' + works.length + "</b> ผลงาน</span>" +
    SITE.categories.slice(0, 3).map((c) => '<span class="fact"><i class="fdot" style="--h:' + c.hue + '"></i><b>' + countIn(c.id) + "</b> " + esc(c.name) + "</span>").join("");
  return '<section class="hero reveal">' +
      '<img class="hlogo" src="' + esc(logoUrl()) + '" alt="โลโก้ ' + esc(SITE.settings.name) + '" width="128" height="128">' +
      '<div class="eyebrow">' + esc(SITE.settings.eyebrow) + "</div>" +
      '<h1><span class="l1">' + esc(np[0].toUpperCase()) + '</span> <span class="l2">' + esc(np[1]) + "</span></h1>" +
      '<p class="lead">' + esc(SITE.settings.tagline) + "</p>" +
      '<div class="ctas"><a class="btn pri" href="#works">ดูผลงานทั้งหมด <span aria-hidden="true">→</span></a><a class="btn" href="#about">เกี่ยวกับฉัน</a></div>' +
      '<div class="facts">' + facts + "</div>" +
    "</section>" +
    '<section class="section"><div class="sec-head"><div><div class="eyebrow">Featured</div><h2>ผลงานเด่น</h2></div><a class="link" href="#works">ดูทั้งหมด →</a></div>' +
      (feat.length ? '<div class="grid">' + feat.map(cardHtml).join("") + "</div>" : emptyHtml("ยังไม่มีผลงาน")) + "</section>" +
    '<section class="section"><div class="sec-head"><div><div class="eyebrow">Categories</div><h2>หมวดหมู่ผลงาน</h2></div></div>' +
      '<div class="cattiles">' + SITE.categories.map((c) =>
        '<button class="cattile" data-a="gocat" data-id="' + esc(c.id) + '" style="--h:' + c.hue + '"><span class="gl">' + (CAT_GLYPH[c.kind] || I.spark) + "</span><h3>" + esc(c.name) + '</h3><span class="cnt">' + countIn(c.id) + ' ผลงาน <span aria-hidden="true">→</span></span></button>').join("") + "</div></section>";
}
function filteredWorks() {
  const q = S.q.trim().toLowerCase();
  return sortedWorks().filter((w) => {
    if (S.filter !== "all" && w.cat !== S.filter) return false;
    if (!q) return true;
    return (w.title + " " + (w.desc || "") + " " + (w.tags || []).join(" ") + " " + catName(w.cat)).toLowerCase().includes(q);
  });
}
function gridHtml() { const ws = filteredWorks(); return ws.length ? '<div class="grid">' + ws.map(cardHtml).join("") + "</div>" : emptyHtml(S.q ? "ไม่พบผลงานที่ตรงกับคำค้น" : "ยังไม่มีผลงานในหมวดนี้"); }
function worksHtml() {
  const chips = '<button class="chip ' + (S.filter === "all" ? "on" : "") + '" data-a="filter" data-id="all">ทั้งหมด <span class="n">' + SITE.works.length + "</span></button>" +
    SITE.categories.map((c) => '<button class="chip ' + (S.filter === c.id ? "on" : "") + '" data-a="filter" data-id="' + esc(c.id) + '">' + esc(c.name) + ' <span class="n">' + countIn(c.id) + "</span></button>").join("");
  return '<section style="padding-top:28px"><div class="sec-head"><div><div class="eyebrow">Showcase</div><h2>ผลงานทั้งหมด</h2></div></div>' +
    '<div class="toolbar"><div class="chips">' + chips + '</div><label class="search glass">' + I.search + '<input id="q" type="search" placeholder="ค้นหาผลงาน แท็ก" value="' + esc(S.q) + '" aria-label="ค้นหาผลงาน"></label></div>' +
    '<div id="gridbox">' + gridHtml() + "</div></section>";
}
function aboutHtml() {
  const a = SITE.about;
  const contacts = (a.contacts || []).filter((c) => c.value).map((c) =>
    '<div class="contact"><span class="k">' + esc(c.label) + '</span><span class="v">' + (isUrl(c.value) ? '<a href="' + esc(c.value) + '" target="_blank" rel="noopener">' + esc(c.value.replace(/^https?:\/\//, "")) + "</a>" : esc(c.value)) + '</span><button data-a="copy" data-v="' + esc(c.value) + '" aria-label="คัดลอก">' + I.copy + "</button></div>").join("");
  const skills = (a.skills || []).filter((s) => s.name).map((s) => { const lv = Math.max(0, Math.min(100, +s.level || 0)); return '<div class="skill"><span>' + esc(s.name) + '</span><span class="mono muted">' + lv + '%</span><div class="bar"><i style="width:' + lv + '%"></i></div></div>'; }).join("");
  const tl = (a.timeline || []).filter((t) => t.title).map((t) => '<div class="tl"><span class="y">' + esc(t.year) + "</span><b>" + esc(t.title) + "</b>" + (t.detail ? "<p>" + esc(t.detail) + "</p>" : "") + "</div>").join("");
  const tools = (a.tools || []).filter(Boolean).map((t) => '<span class="chip">' + esc(t) + "</span>").join("");
  return '<section class="about">' +
    '<aside class="profile glass reveal"><div class="avatar">' + imgTag(a.avatar || logoUrl(), a.name) + "</div><h1>" + esc(a.name) + '</h1><div class="role">' + esc(a.role) + "</div>" +
      (contacts ? '<div class="contacts">' + contacts + "</div>" : "") + "</aside>" +
    '<div><div class="apanel glass reveal"><h2>เรื่องราวของฉัน</h2><p class="bio">' + esc(a.bio) + "</p></div>" +
      (skills ? '<div class="apanel glass reveal"><h2>ทักษะ</h2><div class="skills">' + skills + "</div></div>" : "") +
      (tools ? '<div class="apanel glass reveal"><h2>เครื่องมือที่ใช้</h2><div class="chips">' + tools + "</div></div>" : "") +
      (tl ? '<div class="apanel glass reveal"><h2>เส้นทาง</h2><div class="timeline">' + tl + "</div></div>" : "") +
    "</div></section>";
}
function footerHtml() {
  return '<footer class="wrap"><span>© ' + new Date().getFullYear() + " " + esc(SITE.settings.name) + (SITE.settings.footer ? " · " + esc(SITE.settings.footer) : "") + '</span><a href="#admin" style="color:var(--faint);text-decoration:none;display:inline-flex;gap:6px;align-items:center;font-size:14px">' + I.lock + "ระบบผู้ดูแล</a></footer>";
}
function setupHtml() {
  return '<section class="setup glass reveal"><div class="eyebrow">Setup</div><h1 style="font-size:28px;margin-top:8px">ยังไม่ได้เชื่อมต่อ Firebase</h1>' +
    '<p class="muted" style="margin-top:10px">เว็บพร้อมแล้ว เหลือแค่ใส่ค่าการเชื่อมต่อในไฟล์ <code>js/config.js</code> ตามขั้นตอนใน <code>README.md</code></p>' +
    "<ol><li>สร้างโปรเจกต์ Firebase แล้วเปิด Authentication (Email/Password และ Anonymous)</li><li>สร้าง Cloud Firestore แล้ววางกฎจากไฟล์ <code>firestore.rules</code></li><li>สร้างบัญชีผู้ดูแล <code>jittipat_admin@nextgen-jittipat.web</code></li><li>สร้าง Upload preset แบบ Unsigned ใน Cloudinary</li><li>ใส่ค่าทั้งหมดใน <code>js/config.js</code> แล้วอัปโหลดขึ้น GitHub</li></ol></section>";
}

/* ====== work viewer (deep link, prev/next, lightbox) ====== */
function playerHtml(src, poster, vertical) {
  return '<div class="player' + (vertical ? " vertical" : "") + '" data-player><video src="' + esc(src) + '"' + (poster ? ' poster="' + esc(poster) + '"' : "") + ' playsinline preload="metadata"></video>' +
    '<button class="big" data-p="toggle" aria-label="เล่น">' + I.play + "</button>" +
    '<div class="pbar"><button data-p="toggle" aria-label="เล่นหรือหยุด">' + I.play + '</button><span class="time" data-p="time">0:00 / 0:00</span><input type="range" min="0" max="1000" value="0" data-p="seek" aria-label="ตำแหน่งวิดีโอ"><button data-p="mute" aria-label="ปิดเสียง">' + I.vol + '</button><button data-p="full" aria-label="เต็มจอ">' + I.full + "</button></div></div>";
}
const tfmt = (s) => { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
function bindPlayer(root) {
  $$("[data-player]", root).forEach((p) => {
    const v = $("video", p), seek = $('[data-p="seek"]', p), time = $('[data-p="time"]', p);
    const sync = () => { const playing = !v.paused && !v.ended; p.classList.toggle("playing", playing); $$('[data-p="toggle"]', p).forEach((b) => { b.innerHTML = playing ? I.pause : I.play; }); };
    ["play", "pause", "ended"].forEach((e) => v.addEventListener(e, sync));
    v.addEventListener("timeupdate", () => { if (v.duration) seek.value = v.currentTime / v.duration * 1000; time.textContent = tfmt(v.currentTime) + " / " + tfmt(v.duration); });
    v.addEventListener("loadedmetadata", () => { time.textContent = "0:00 / " + tfmt(v.duration); });
    v.addEventListener("click", () => { v.paused ? v.play().catch(() => {}) : v.pause(); });
    seek.addEventListener("input", () => { if (v.duration) v.currentTime = seek.value / 1000 * v.duration; });
    p.addEventListener("click", (e) => {
      const b = e.target.closest("[data-p]"); if (!b) return; const k = b.getAttribute("data-p");
      if (k === "toggle") v.paused ? v.play().catch(() => {}) : v.pause();
      if (k === "mute") { v.muted = !v.muted; b.innerHTML = v.muted ? I.mute : I.vol; }
      if (k === "full") { try { const r = document.fullscreenElement ? document.exitFullscreen() : (p.requestFullscreen ? p.requestFullscreen() : v.webkitEnterFullscreen && v.webkitEnterFullscreen()); if (r && r.catch) r.catch(() => {}); } catch (err) {} }
    });
  });
}
function viewerHtml(w) {
  const hue = catHue(w.cat);
  let media = "";
  if (w.kind === "video" && w.video) media = playerHtml(w.video, w.cover || api.videoPosterUrl(w.video), w.vertical);
  else if (w.kind === "youtube" && ytId(w.url)) media = '<div class="embed"><iframe src="https://www.youtube-nocookie.com/embed/' + ytId(w.url) + '?rel=0" title="' + esc(w.title) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>';
  else if (w.kind === "tiktok" && ttId(w.url)) media = '<div class="embed v"><iframe src="https://www.tiktok.com/embed/v2/' + ttId(w.url) + '" title="' + esc(w.title) + '" allow="encrypted-media; fullscreen" allowfullscreen loading="lazy"></iframe></div>';
  else if (w.kind === "image" && (w.images || []).length) media = '<div class="gallery">' + w.images.map((u, i) => imgTag(u, w.title + " ภาพที่ " + (i + 1), ' data-a="zoom" data-i="' + i + '"')).join("") + "</div>";
  else if (w.url && isUrl(w.url)) media = '<div class="extcard">' + coverFor(w, true) + '<div class="over"><a class="btn pri" href="' + esc(w.url) + '" target="_blank" rel="noopener">' + I.ext + "เปิดลิงก์ผลงาน</a></div></div>";
  else if (coverUrl(w)) media = '<div class="gallery">' + imgTag(coverUrl(w), w.title, ' data-a="zoom" data-i="0"') + "</div>";
  else if (w.kind !== "code") media = '<div class="extcard">' + genCover(w.kind, hue, true) + "</div>";
  const code = w.code && w.code.text ? '<div style="margin-top:20px"><div class="codehead"><span>' + esc(w.code.lang || "code") + '</span><button class="btn sm" data-a="copycode">' + I.copy + 'คัดลอกโค้ด</button></div><pre class="code" id="codeblock">' + w.code.text.split("\n").map((l) => '<span class="ln">' + (esc(l) || " ") + "</span>").join("") + "</pre></div>" : "";
  const tags = (w.tags || []).length ? '<div><dt>แท็ก</dt><dd class="chips" style="gap:6px;margin-top:6px">' + w.tags.map((t) => '<span class="tag">#' + esc(t) + "</span>").join("") + "</dd></div>" : "";
  const ctx = S.viewer.ctx, pos = ctx.indexOf(w.id);
  return '<div class="mbox" role="dialog" aria-modal="true" aria-label="' + esc(w.title) + '">' +
    '<div class="mhead"><span class="eyebrow">' + esc((KIND[w.kind] || KIND.link).badge) + (ctx.length > 1 ? ' <span class="mcount">· ' + (pos + 1) + "/" + ctx.length + "</span>" : "") + '</span><div class="mtools"><button class="btn sm" data-a="sharelink">' + I.link + 'คัดลอกลิงก์</button><button class="iconbtn" data-a="closeviewer" aria-label="ปิด">' + I.x + "</button></div></div>" +
    (media ? '<div class="mmedia">' + media + "</div>" : "") +
    '<div class="mcontent"><div><h2>' + esc(w.title) + "</h2>" + (w.desc ? '<p class="desc">' + esc(w.desc) + "</p>" : "") + code + "</div>" +
    '<div class="side"><dl><div><dt>หมวดหมู่</dt><dd><span style="color:hsl(' + hue + ' 85% 55%)">●</span> ' + esc(catName(w.cat)) + "</dd></div>" +
      (w.year ? '<div><dt>ปี</dt><dd class="mono">' + esc(w.year) + "</dd></div>" : "") + tags +
      (w.link ? '<div><a class="btn sm pri" href="' + esc(w.link) + '" target="_blank" rel="noopener">' + I.ext + "เปิดโปรเจกต์</a></div>" : "") +
      ((w.kind === "youtube" || w.kind === "tiktok") && w.url ? '<div><a class="btn sm" href="' + esc(w.url) + '" target="_blank" rel="noopener">' + I.ext + "ดูบน " + (w.kind === "youtube" ? "YouTube" : "TikTok") + "</a></div>" : "") +
    "</dl></div></div></div>" +
    (ctx.length > 1 ? '<button class="mnavbtn prev" data-a="prevwork" aria-label="ผลงานก่อนหน้า">' + I.left + '</button><button class="mnavbtn next" data-a="nextwork" aria-label="ผลงานถัดไป">' + I.right + "</button>" : "");
}
function showWork(id, ctx, fromClick) {
  const w = workById(id); if (!w) { if (S.loaded) toast("ไม่พบผลงานนี้ อาจถูกลบไปแล้ว", "bad"); return; }
  const fresh = !S.viewer;
  S.viewer = { id, ctx: ctx || (S.viewer ? S.viewer.ctx : sortedWorks().map((x) => x.id)), fromClick: S.viewer ? S.viewer.fromClick : !!fromClick };
  if (S.viewer.ctx.indexOf(id) < 0) S.viewer.ctx = sortedWorks().map((x) => x.id);
  if (fresh) openModal(viewerHtml(w));
  else { $$("#modal-root video").forEach((v) => { try { v.pause(); } catch (e) {} }); $("#modal-root .modal").innerHTML = viewerHtml(w); $("#modal-root .mbox").scrollTop = 0; }
  bindPlayer($("#modal-root"));
  bindSwipe($("#modal-root .mbox"), (dir) => stepWork(dir));
  document.title = w.title + " · " + SITE.settings.name;
  hit("work", w.id);
}
function stepWork(dir) {
  if (!S.viewer) return;
  const ctx = S.viewer.ctx; if (ctx.length < 2) return;
  const i = (ctx.indexOf(S.viewer.id) + dir + ctx.length) % ctx.length;
  try { history.replaceState(null, "", "#work/" + ctx[i]); } catch (e) {}
  showWork(ctx[i]);
}
function closeViewer() {
  const from = S.viewer && S.viewer.fromClick;
  closeModal(); document.title = SITE.settings.name;
  if (from && history.length > 1) history.back();
  else { try { history.replaceState(null, "", "#" + S.route); } catch (e) {} }
}
function bindSwipe(el, cb) {
  if (!el) return; let x0 = null, y0 = 0;
  el.addEventListener("touchstart", (e) => { if (e.touches.length !== 1 || e.target.closest("iframe,input,.pbar")) { x0 = null; return; } x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  el.addEventListener("touchend", (e) => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) cb(dx < 0 ? 1 : -1); }, { passive: true });
}
async function copyLink(url, msg) {
  try { await navigator.clipboard.writeText(url); toast(msg || "คัดลอกลิงก์แล้ว ส่งให้คนอื่นเปิดผลงานนี้ได้เลย", "good"); }
  catch (e) { toast(url); }
}

function openLightbox(list, i) {
  S.lb = { list, i };
  let el = $("#lightbox");
  if (!el) { el = document.createElement("div"); el.id = "lightbox"; document.body.appendChild(el); }
  renderLightbox();
}
function renderLightbox() {
  const el = $("#lightbox"), lb = S.lb; if (!el || !lb) return;
  el.classList.remove("zoomed");
  el.innerHTML = '<img class="lbimg" src="' + esc(lb.list[lb.i]) + '" alt="ภาพขยาย">' +
    '<div class="lbbar"><span>' + (lb.i + 1) + " / " + lb.list.length + '</span><button data-lb="close" aria-label="ปิดภาพขยาย">' + I.x + "</button></div>" +
    (lb.list.length > 1 ? '<button class="lbarrow prev" data-lb="prev" aria-label="ภาพก่อนหน้า">' + I.left + '</button><button class="lbarrow next" data-lb="next" aria-label="ภาพถัดไป">' + I.right + "</button>" : "") +
    '<div class="lbhint">คลิกภาพเพื่อซูม · ลากเมาส์เพื่อดูรายละเอียด · Esc เพื่อปิด</div>';
  const im = $(".lbimg", el);
  im.addEventListener("click", (e) => {
    e.stopPropagation();
    const r = im.getBoundingClientRect();
    im.style.transformOrigin = ((e.clientX - r.left) / r.width * 100) + "% " + ((e.clientY - r.top) / r.height * 100) + "%";
    el.classList.toggle("zoomed");
  });
  im.addEventListener("mousemove", (e) => {
    if (!el.classList.contains("zoomed")) return;
    const r = im.getBoundingClientRect();
    im.style.transformOrigin = Math.max(0, Math.min(100, (e.clientX - r.left) / r.width * 100)) + "% " + Math.max(0, Math.min(100, (e.clientY - r.top) / r.height * 100)) + "%";
  });
  bindSwipe(el, (d) => { if (!el.classList.contains("zoomed")) stepLightbox(d); });
}
function stepLightbox(d) { const lb = S.lb; if (!lb || lb.list.length < 2) return; lb.i = (lb.i + d + lb.list.length) % lb.list.length; renderLightbox(); }
function closeLightbox() { const el = $("#lightbox"); if (el) el.remove(); S.lb = null; }

/* ====== admin ====== */
function loginHtml() {
  return '<section class="login glass reveal"><img class="lg" src="' + esc(logoUrl()) + '" alt="">' +
    '<h1>ระบบผู้ดูแล</h1><p class="muted" style="margin:6px 0 22px">เข้าสู่ระบบเพื่อจัดการผลงานและหน้าเว็บ</p>' +
    '<form class="form" id="loginf"><div class="field"><label for="lu">ชื่อผู้ใช้</label><input class="inp" id="lu" autocomplete="username" required></div>' +
    '<div class="field"><label for="lp">รหัสผ่าน</label><input class="inp" id="lp" type="password" autocomplete="current-password" required></div>' +
    '<p class="err" id="lerr"></p><button class="btn pri" id="lbtn" style="justify-content:center">' + I.lock + "เข้าสู่ระบบ</button></form></section>";
}
function adminHtml() {
  if (!S.authReady) return '<section class="login glass"><h1>ระบบผู้ดูแล</h1><div class="loadingbar"></div></section>';
  if (!S.admin) return loginHtml();
  const tabs = [["dash", "แดชบอร์ด", I.dash], ["works", "ผลงาน", I.grid], ["cats", "หมวดหมู่", I.folder], ["about", "เกี่ยวกับฉัน", I.user], ["settings", "ตั้งค่าเว็บ", I.gear]];
  return '<section class="admin"><nav class="aside glass" aria-label="เมนูผู้ดูแล">' + tabs.map((t) =>
      '<button class="' + (S.atab === t[0] ? "on" : "") + '" data-a="atab" data-id="' + t[0] + '">' + t[2] + t[1] + "</button>").join("") +
    '<hr><button data-a="logout">' + I.out + "ออกจากระบบ</button></nav>" +
    '<div><div class="abar glass"><span class="status"><i></i>เชื่อมต่อ Firebase แล้ว · การแก้ไขขึ้นเว็บทันทีที่บันทึก</span><a class="btn sm" href="#home">' + I.eye + "ดูหน้าเว็บ</a></div>" +
    '<div id="amain">' + adminTab() + "</div></div></section>";
}
function adminTab() { return ({ dash: dashHtml, works: aWorksHtml, cats: aCatsHtml, about: aAboutHtml, settings: aSettingsHtml }[S.atab] || dashHtml)(); }
function rerenderTab() { const m = $("#amain"); if (m) m.innerHTML = adminTab(); }

/* dashboard */
function dashHtml() {
  const head = '<div class="panel glass"><h2>แดชบอร์ดผู้เข้าชม</h2><p class="muted" style="margin-top:10px">';
  if (S.visitsErr) return head + esc(S.visitsErr) + "</p></div>";
  if (!S.visits) return head + 'กำลังโหลดข้อมูลผู้เข้าชม...</p><div class="loadingbar"></div></div>';
  const docs = S.visits, today = dkey(new Date()); let tot = 0, td = 0, wk = 0; const pages = {}, works = {}, days = {};
  const since7 = new Date(); since7.setDate(since7.getDate() - 6); const k7 = dkey(since7);
  docs.forEach((d) => {
    tot += d.visits || 0;
    Object.entries(d.days || {}).forEach(([k, n]) => { days[k] = (days[k] || 0) + n; if (k === today) td += n; if (k >= k7) wk += n; });
    Object.entries(d.pages || {}).forEach(([k, n]) => { pages[k] = (pages[k] || 0) + n; });
    Object.entries(d.works || {}).forEach(([k, n]) => { works[k] = (works[k] || 0) + n; });
  });
  const totalWorkViews = Object.values(works).reduce((a, n) => a + n, 0);
  const kp = (l, v, s) => '<div class="kpi glass"><span>' + l + "</span><b>" + v.toLocaleString("th-TH") + "</b>" + (s ? "<small>" + s + "</small>" : "") + "</div>";
  let html = '<div class="kpis">' + kp("ผู้เข้าชม (คน)", docs.length, "นับไม่ซ้ำอุปกรณ์") + kp("การเข้าชมทั้งหมด", tot, "ครั้ง") + kp("วันนี้", td, "ครั้ง") + kp("7 วันล่าสุด", wk, "ครั้ง") + kp("เปิดดูผลงาน", totalWorkViews, "ครั้ง") + "</div>";
  html += '<div class="panel glass"><div class="ph"><h2>การเข้าชม 14 วันล่าสุด</h2><span class="tag">ครั้ง/วัน</span></div><div class="chartwrap">' + lineChart(days) + "</div></div>";
  const pl = { home: "หน้าแรก", works: "ผลงาน", about: "เกี่ยวกับฉัน" };
  const pmax = Math.max(1, ...Object.keys(pl).map((k) => pages[k] || 0));
  const pagesH = Object.keys(pl).map((k) => { const n = pages[k] || 0; return '<div class="hbar"><span class="lbl">' + pl[k] + '</span><span class="mono">' + n + '</span><div class="t"><i style="width:' + (n / pmax * 100) + '%"></i></div></div>'; }).join("");
  const top = Object.entries(works).sort((a, b) => b[1] - a[1]).slice(0, 6), wmax = top.length ? top[0][1] : 1;
  const topH = top.length ? top.map(([id, n]) => { const w = workById(id); return '<div class="hbar"><span class="lbl">' + esc(w ? w.title : "ผลงานที่ลบแล้ว") + '</span><span class="mono">' + n + '</span><div class="t"><i style="width:' + (n / wmax * 100) + '%"></i></div></div>'; }).join("") : '<p class="muted">ยังไม่มีใครเปิดดูผลงาน</p>';
  html += '<div class="dash2"><div class="panel glass"><div class="ph"><h2>หน้าที่ถูกเข้าชม</h2></div><div class="hbars">' + pagesH + '</div></div><div class="panel glass"><div class="ph"><h2>ผลงานยอดนิยม</h2></div><div class="hbars">' + topH + "</div></div></div>";
  const recent = docs.slice().sort((a, b) => ((b.last || "") > (a.last || "") ? 1 : -1)).slice(0, 8);
  html += '<div class="panel glass" style="margin-top:16px"><div class="ph"><h2>ผู้เข้าชมล่าสุด</h2></div>' + (recent.length ? '<div class="hbars">' + recent.map((d, i) =>
    '<div class="hbar"><span class="lbl">ผู้เข้าชมรายที่ ' + (i + 1) + " · เข้าชม " + (d.visits || 0) + " ครั้ง · เปิดผลงาน " + Object.values(d.works || {}).reduce((a, n) => a + n, 0) + ' ครั้ง</span><span class="mono muted">' + ago(d.last) + "</span></div>").join("") + "</div>" : '<p class="muted">ยังไม่มีผู้เข้าชม</p>') +
    '<p class="note">นับแยกตามอุปกรณ์และเบราว์เซอร์ การเข้าชมของผู้ดูแลไม่นับรวม</p></div>';
  return html;
}
function lineChart(days) {
  const n = 14, pts = [], d = new Date(); d.setDate(d.getDate() - (n - 1));
  for (let i = 0; i < n; i++) { const k = dkey(d); pts.push({ lbl: d.getDate() + "/" + (d.getMonth() + 1), v: days[k] || 0 }); d.setDate(d.getDate() + 1); }
  const max = Math.max(...pts.map((p) => p.v)), step = max <= 4 ? 1 : Math.ceil(max / 4), top = Math.max(4, step * 4);
  const W = 640, H = 220, L = 36, R = 14, T = 14, B = 30, iw = W - L - R, ih = H - T - B;
  const x = (i) => L + i * iw / (n - 1), y = (v) => T + ih - v / top * ih;
  let grid = "";
  for (let g = 0; g <= 4; g++) { const gv = step * g, gy = y(gv); grid += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + gy + '" y2="' + gy + '" style="stroke:var(--line)" stroke-width="1"/><text x="' + (L - 8) + '" y="' + (gy + 4) + '" text-anchor="end" style="fill:var(--faint);font:11px var(--f-mono)">' + gv + "</text>"; }
  const line = pts.map((p, i) => (i ? "L" : "M") + x(i).toFixed(1) + " " + y(p.v).toFixed(1)).join(" ");
  const area = line + " L" + x(n - 1) + " " + (T + ih) + " L" + L + " " + (T + ih) + " Z";
  const labels = pts.map((p, i) => (i % 2 === 0 || i === n - 1) ? '<text x="' + x(i) + '" y="' + (H - 8) + '" text-anchor="middle" style="fill:var(--faint);font:11px var(--f-mono)">' + p.lbl + "</text>" : "").join("");
  const dots = pts.map((p, i) => '<circle cx="' + x(i) + '" cy="' + y(p.v) + '" r="' + (i === n - 1 ? 5 : 2.5) + '" style="fill:' + (i === n - 1 ? "var(--accent)" : "var(--bg)") + ';stroke:var(--accent)" stroke-width="2"><title>' + p.lbl + ": " + p.v + " ครั้ง</title></circle>").join("");
  return '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="กราฟการเข้าชม 14 วัน"><defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--accent);stop-opacity:.35"/><stop offset="1" style="stop-color:var(--accent);stop-opacity:0"/></linearGradient></defs>' +
    grid + '<path d="' + area + '" fill="url(#ag)"/><path d="' + line + '" fill="none" style="stroke:var(--accent)" stroke-width="2.5" stroke-linejoin="round"/>' + dots + labels +
    '<text x="' + x(n - 1) + '" y="' + (y(pts[n - 1].v) - 12) + '" text-anchor="end" style="fill:var(--fg);font:600 12px var(--f-mono)">วันนี้ ' + pts[n - 1].v + "</text></svg>";
}

/* works */
function aWorksHtml() {
  const ws = sortedWorks();
  return '<div class="panel glass"><div class="ph"><h2>ผลงาน <span class="mono muted" style="font-size:16px">(' + ws.length + ')</span></h2><button class="btn sm pri" data-a="newwork">' + I.plus + "เพิ่มผลงาน</button></div>" +
    (api.uploadsConfigured ? "" : '<p class="note" style="margin:-6px 0 12px;color:var(--warn)">ยังไม่ได้ตั้งค่า Cloudinary จึงอัปโหลดรูปหรือวิดีโอไม่ได้ ใช้ลิงก์ YouTube/TikTok ได้ตามปกติ</p>') +
    (ws.length ? '<div class="list">' + ws.map((w) =>
      '<div class="li"><div class="th" style="--h:' + catHue(w.cat) + '">' + coverFor(w) + '</div><div class="tx"><b>' + esc(w.title) + "</b><span>" + esc(catName(w.cat)) + " · " + esc((KIND[w.kind] || KIND.link).label) + (w.year ? " · " + esc(w.year) : "") + "</span></div>" +
        '<div class="acts"><button class="xbtn" data-a="feat" data-id="' + esc(w.id) + '" aria-label="ผลงานเด่น" title="ผลงานเด่น" style="' + (w.featured ? "color:var(--warn);border-color:var(--warn)" : "") + '">' + (w.featured ? I.starf : I.star) + "</button>" +
        '<button class="xbtn" data-a="sharework" data-id="' + esc(w.id) + '" aria-label="คัดลอกลิงก์" title="คัดลอกลิงก์">' + I.link + "</button>" +
        '<button class="xbtn" data-a="editwork" data-id="' + esc(w.id) + '" aria-label="แก้ไข" title="แก้ไข">' + I.edit + '</button><button class="xbtn" data-a="delwork" data-id="' + esc(w.id) + '" aria-label="ลบ" title="ลบ">' + I.trash + "</button></div></div>").join("") + "</div>" : '<p class="muted">ยังไม่มีผลงาน กด เพิ่มผลงาน เพื่อเริ่ม</p>') + "</div>";
}
const catOptions = (sel) => SITE.categories.map((c) => '<option value="' + esc(c.id) + '"' + (c.id === sel ? " selected" : "") + ">" + esc(c.name) + "</option>").join("") + '<option value=""' + (!sel ? " selected" : "") + ">ไม่ระบุหมวด</option>";
function editorHtml() {
  const w = S.edit.work;
  const seg = Object.keys(KIND).map((k) => '<button type="button" class="' + (w.kind === k ? "on" : "") + '" data-a="ekind" data-id="' + k + '">' + KIND[k].icon + KIND[k].label + "</button>").join("");
  const sec = (kinds, html) => '<div data-kinds="' + kinds + '"' + (kinds.split(" ").includes(w.kind) ? "" : " hidden") + ' class="form">' + html + "</div>";
  const drop = (id, label, accept, multi) => '<label class="drop" for="' + id + '">' + I.upload + "<span>" + label + '</span></label><input type="file" id="' + id + '" accept="' + accept + '"' + (multi ? " multiple" : "") + " hidden>";
  return '<div class="mbox" style="width:min(760px,100%)" role="dialog" aria-modal="true" aria-label="แก้ไขผลงาน"><div class="mhead"><h2 style="font-size:22px">' + (S.edit.isNew ? "เพิ่มผลงานใหม่" : "แก้ไขผลงาน") + '</h2><button class="iconbtn" data-a="close" aria-label="ปิด">' + I.x + "</button></div>" +
    '<form class="form" id="workf" style="padding:18px 20px 22px">' +
    '<div class="field"><label for="e-title">ชื่อผลงาน</label><input class="inp" id="e-title" data-e="title" value="' + esc(w.title) + '" required></div>' +
    '<div class="row2"><div class="field"><label for="e-cat">หมวดหมู่</label><select class="inp" id="e-cat" data-e="cat">' + catOptions(w.cat) + '</select></div><div class="field"><label for="e-year">ปี</label><input class="inp" id="e-year" data-e="year" value="' + esc(w.year) + '" inputmode="numeric"></div></div>' +
    '<div class="field"><label>ประเภทผลงาน</label><div class="seg">' + seg + "</div></div>" +
    sec("video", '<div class="field"><label>ไฟล์วิดีโอ</label>' + drop("e-vfile", "คลิกหรือลากไฟล์วิดีโอมาวาง (ไม่เกิน 100 MB)", "video/*") + '<div class="thumbs" id="e-vthumbs"></div></div>' +
      '<label class="switch"><input type="checkbox" id="e-vert" data-e="vertical"' + (w.vertical ? " checked" : "") + ">วิดีโอแนวตั้ง 9:16 (เช่นคลิปสั้น)</label>") +
    sec("youtube tiktok link", '<div class="field"><label for="e-url">ลิงก์ผลงาน</label><input class="inp" id="e-url" data-e="url" type="url" value="' + esc(w.url) + '" placeholder="https://"><small id="e-urlhint">' + urlHint(w) + "</small></div>") +
    sec("image", '<div class="field"><label>รูปภาพ (เลือกได้หลายรูป)</label>' + drop("e-ifile", "คลิกหรือลากรูปมาวาง ระบบจะย่อขนาดให้อัตโนมัติ", "image/*", true) + '<div class="thumbs" id="e-ithumbs"></div></div>') +
    sec("code", '<div class="field"><label for="e-lang">ภาษา</label><input class="inp" id="e-lang" data-e="code.lang" value="' + esc(w.code.lang) + '" placeholder="JavaScript"></div>' +
      '<div class="field"><label for="e-code">โค้ดตัวอย่าง</label><textarea class="inp code" id="e-code" data-e="code.text" spellcheck="false">' + esc(w.code.text) + "</textarea></div>") +
    '<div class="field"><label>ภาพหน้าปก <span class="muted">(ไม่บังคับ YouTube และวิดีโอที่อัปโหลดจะมีภาพหน้าปกให้อัตโนมัติ)</span></label>' + drop("e-cfile", "เลือกภาพหน้าปก", "image/*") + '<div class="thumbs" id="e-cthumbs"></div></div>' +
    '<div id="e-progress"></div>' +
    '<div class="field"><label for="e-desc">คำอธิบาย</label><textarea class="inp" id="e-desc" data-e="desc">' + esc(w.desc) + "</textarea></div>" +
    '<div class="row2"><div class="field"><label for="e-tags">แท็ก</label><input class="inp" id="e-tags" data-e="tagstr" value="' + esc((w.tags || []).join(", ")) + '" placeholder="Premiere, Short film"><small>คั่นด้วยจุลภาค</small></div><div class="field"><label for="e-link">ลิงก์โปรเจกต์เพิ่มเติม</label><input class="inp" id="e-link" data-e="link" type="url" value="' + esc(w.link) + '" placeholder="https://github.com/..."></div></div>' +
    '<label class="switch"><input type="checkbox" id="e-feat" data-e="featured"' + (w.featured ? " checked" : "") + ">แสดงเป็นผลงานเด่นบนหน้าแรก</label>" +
    '<div style="display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;margin-top:6px"><button type="button" class="btn" data-a="close">ยกเลิก</button><button class="btn pri" id="e-save">' + I.save + (S.edit.isNew ? "เพิ่มผลงาน" : "บันทึกการแก้ไข") + "</button></div>" +
    "</form></div>";
}
function urlHint(w) {
  if (w.kind === "youtube") return w.url ? (ytId(w.url) ? "✓ พบคลิป YouTube แล้ว จะเล่นในหน้าเว็บได้" : "ยังอ่านลิงก์ไม่ได้ ใช้ลิงก์แบบ youtube.com/watch?v=... หรือ youtu.be/...") : "วางลิงก์คลิป YouTube หรือ Shorts";
  if (w.kind === "tiktok") return w.url ? (ttId(w.url) ? "✓ พบคลิป TikTok แล้ว จะเล่นในหน้าเว็บได้" : "ใช้ลิงก์เต็มแบบ tiktok.com/@ชื่อ/video/ตัวเลข (ลิงก์ย่อ vt.tiktok.com จะเล่นในหน้าเว็บไม่ได้)") : "วางลิงก์คลิป TikTok แบบเต็ม";
  return "ลิงก์เว็บไซต์หรือหน้าผลงาน";
}
const tm = (url, kind, act, key) => '<div class="tm">' + (kind === "video" ? '<video src="' + esc(url) + '" muted preload="metadata"></video>' : imgTag(url)) + '<button type="button" data-a="' + act + '" data-id="' + esc(key) + '" aria-label="นำออก">×</button></div>';
function refreshThumbs() {
  const w = S.edit && S.edit.work; if (!w) return;
  const a = $("#e-vthumbs"), b = $("#e-ithumbs"), c = $("#e-cthumbs");
  if (a) a.innerHTML = w.video ? tm(w.video, "video", "rmvid", "v") : "";
  if (b) b.innerHTML = (w.images || []).map((u, i) => tm(u, "img", "rmimg", i)).join("");
  if (c) c.innerHTML = w.cover ? tm(w.cover, "img", "rmcover", "c") : "";
}
function openEditor(id) {
  const w = id ? workById(id) : null;
  const base = { id: uid("w"), title: "", cat: (SITE.categories[0] || {}).id || "", kind: "youtube", video: "", images: [], cover: "", url: "", desc: "", tags: [], year: String(new Date().getFullYear()), link: "", code: { lang: "", text: "" }, featured: false, vertical: false, created: Date.now() };
  const copy = Object.assign({}, base, w ? clone(w) : {});
  copy.code = copy.code || { lang: "", text: "" }; copy.images = copy.images || [];
  S.edit = { work: copy, isNew: !w, uploading: 0 };
  openModal(editorHtml()); refreshThumbs();
}
async function saveEditor() {
  const w = S.edit.work;
  if (S.edit.uploading) { toast("รอให้อัปโหลดไฟล์เสร็จก่อน", "bad"); return; }
  if (!w.title.trim()) { toast("กรุณาใส่ชื่อผลงาน", "bad"); $("#e-title").focus(); return; }
  if (["youtube", "tiktok", "link"].includes(w.kind) && w.url && !isUrl(w.url)) { toast("ลิงก์ต้องขึ้นต้นด้วย https://", "bad"); return; }
  if (w.kind === "video" && !w.video) { toast("ยังไม่ได้อัปโหลดไฟล์วิดีโอ", "bad"); return; }
  if (w.link && !isUrl(w.link)) w.link = "https://" + w.link;
  if (w.kind !== "video") w.video = "";
  if (w.kind !== "image") w.images = [];
  if (["video", "image", "code"].includes(w.kind)) w.url = "";
  const btn = $("#e-save"); if (btn) btn.disabled = true;
  try {
    await api.saveWork(w);
    const i = SITE.works.findIndex((x) => x.id === w.id);
    if (i > -1) SITE.works[i] = w; else SITE.works.push(w);
    const isNew = S.edit.isNew;
    closeModal(); rerenderTab();
    toast(isNew ? "เพิ่มผลงานแล้ว ผู้ชมเห็นได้ทันที" : "บันทึกการแก้ไขแล้ว", "good");
  } catch (e) { if (btn) btn.disabled = false; toast(saveErr(e), "bad"); }
}
function saveErr(e) {
  const c = (e && e.code) || "";
  if (c.includes("permission")) return "ไม่มีสิทธิ์บันทึก ตรวจว่าเข้าสู่ระบบด้วยบัญชีผู้ดูแล และวางกฎ firestore.rules แล้ว";
  if (c.includes("unavailable") || c.includes("network")) return "เชื่อมต่ออินเทอร์เน็ตไม่ได้ ลองอีกครั้ง";
  return "บันทึกไม่สำเร็จ (" + (c || "unknown") + ")";
}

/* uploads */
function loadImg(src) { return new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = src; }); }
async function compressImage(file, max) {
  if (/svg|gif/.test(file.type)) return file;
  const url = URL.createObjectURL(file);
  try {
    const im = await loadImg(url);
    const s = Math.min(1, max / Math.max(im.naturalWidth, im.naturalHeight));
    if (s === 1 && file.size < 1.5 * 1048576) return file;
    const c = document.createElement("canvas"); c.width = Math.round(im.naturalWidth * s); c.height = Math.round(im.naturalHeight * s);
    c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
    const blob = await new Promise((r) => c.toBlob(r, "image/webp", 0.86));
    return blob || file;
  } finally { URL.revokeObjectURL(url); }
}
function progressUI(label) {
  const box = $("#e-progress") || $("#s-progress"); if (!box) return () => {};
  const row = document.createElement("div"); row.className = "uploading";
  row.innerHTML = "<span>" + esc(label) + '</span><div class="progress"><i></i></div>'; box.appendChild(row);
  return (p, done) => { const i = $("i", row); if (i) i.style.width = Math.round(p * 100) + "%"; if (done) row.remove(); };
}
async function uploadFile(file, label, maxImg) {
  if (!api.uploadsConfigured) { toast("ยังไม่ได้ตั้งค่า Cloudinary ใน js/config.js", "bad"); throw new Error("no-uploads"); }
  const body = /^image\//.test(file.type) ? await compressImage(file, maxImg || 2000) : file;
  const prog = progressUI(label);
  try { const r = await api.upload(body, (p) => prog(p)); prog(1, true); return r; }
  catch (e) { prog(0, true); toast("อัปโหลดไม่สำเร็จ: " + ((e && e.message) || "ลองอีกครั้ง"), "bad"); throw e; }
}
async function handleFiles(id, fileList) {
  const files = Array.from(fileList || []); if (!files.length) return;
  const w = S.edit && S.edit.work;
  const track = async (fn) => { if (S.edit) S.edit.uploading++; try { await fn(); } catch (e) {} finally { if (S.edit) S.edit.uploading--; } };
  if (id === "e-vfile" && w) {
    const f = files[0];
    if (!/^video\//.test(f.type)) { toast("ไฟล์นี้ไม่ใช่วิดีโอ", "bad"); return; }
    if (f.size > 100 * 1048576) { toast("วิดีโอใหญ่เกิน 100 MB ลองบีบอัดไฟล์ก่อน หรือใช้ลิงก์ YouTube แทน", "bad"); return; }
    await track(async () => { const r = await uploadFile(f, "กำลังอัปโหลด " + f.name); w.video = r.url; if (!w.cover) w.cover = api.videoPosterUrl(r.url); if (r.height > r.width) { w.vertical = true; const cb = $("#e-vert"); if (cb) cb.checked = true; } refreshThumbs(); });
  }
  if (id === "e-ifile" && w) {
    await track(() => Promise.all(files.filter((f) => /^image\//.test(f.type)).map(async (f) => { const r = await uploadFile(f, "กำลังอัปโหลด " + f.name); w.images.push(r.url); refreshThumbs(); })));
  }
  if (id === "e-cfile" && w) await track(async () => { const r = await uploadFile(files[0], "กำลังอัปโหลดภาพหน้าปก", 1600); w.cover = r.url; refreshThumbs(); });
  if (id === "f-avatar" && S.draft) await track(async () => { const r = await uploadFile(files[0], "กำลังอัปโหลดรูปโปรไฟล์", 800); S.draft.about.avatar = r.url; rerenderTab(); });
  if (id === "f-logo" && S.draft) await track(async () => { const r = await uploadFile(files[0], "กำลังอัปโหลดโลโก้", 512); S.draft.settings.logo = r.url; rerenderTab(); });
}

/* categories */
function aCatsHtml() {
  const nc = S.newCat;
  const kinds = [["video", "วิดีโอ"], ["motion", "โมชัน"], ["graphic", "กราฟิก"], ["code", "โค้ด"], ["other", "อื่น ๆ"]];
  const kseg = (sel, act, id) => '<div class="seg">' + kinds.map((k) => '<button type="button" class="' + (sel === k[0] ? "on" : "") + '" data-a="' + act + '" data-id="' + k[0] + '"' + (id ? ' data-c="' + esc(id) + '"' : "") + ">" + CAT_GLYPH[k[0]] + k[1] + "</button>").join("") + "</div>";
  const hues = (sel, act, id) => '<div class="hues">' + HUES.map((h) => '<button type="button" class="' + (sel === h ? "on" : "") + '" style="--h:' + h + '" data-a="' + act + '" data-id="' + h + '"' + (id ? ' data-c="' + esc(id) + '"' : "") + ' aria-label="สีโทน ' + h + '"></button>').join("") + "</div>";
  return '<div class="panel glass"><div class="ph"><h2>สร้างหมวดหมู่ใหม่</h2></div><form class="form" id="catf">' +
      '<div class="field"><label for="nc-name">ชื่อหมวดหมู่</label><input class="inp" id="nc-name" value="' + esc(nc.name) + '" placeholder="เช่น MV / งานอีเวนต์ / UI Design" required></div>' +
      '<div class="field"><label>ไอคอน</label>' + kseg(nc.kind, "nckind") + '</div><div class="field"><label>สีประจำหมวด</label>' + hues(nc.hue, "nchue") + "</div>" +
      '<div><button class="btn pri sm">' + I.plus + "สร้างหมวดหมู่</button></div></form></div>" +
    '<div class="panel glass"><div class="ph"><h2>หมวดหมู่ทั้งหมด <span class="mono muted" style="font-size:16px">(' + SITE.categories.length + ')</span></h2></div><div class="list">' +
      SITE.categories.map((c, i) =>
        '<div class="li" style="flex-wrap:wrap"><span class="swatch" style="--h:' + c.hue + '">' + (CAT_GLYPH[c.kind] || I.spark) + "</span>" +
          '<div class="tx"><input class="inp" id="cn-' + esc(c.id) + '" data-cname="' + esc(c.id) + '" value="' + esc(c.name) + '" aria-label="ชื่อหมวดหมู่"></div>' +
          '<span class="mono muted" style="font-size:13px">' + countIn(c.id) + " ผลงาน</span>" +
          '<div class="acts"><button class="xbtn" data-a="catmove" data-id="' + i + '" data-d="-1" aria-label="เลื่อนขึ้น"' + (i ? "" : " disabled") + ">" + I.up + '</button><button class="xbtn" data-a="catmove" data-id="' + i + '" data-d="1" aria-label="เลื่อนลง"' + (i < SITE.categories.length - 1 ? "" : " disabled") + ">" + I.down + '</button><button class="xbtn" data-a="delcat" data-id="' + esc(c.id) + '" aria-label="ลบหมวดหมู่">' + I.trash + "</button></div>" +
          '<div style="width:100%;display:grid;gap:8px;padding-left:50px">' + kseg(c.kind, "ckind", c.id) + hues(c.hue, "chue", c.id) + "</div></div>").join("") +
      '</div><p class="note">แก้ชื่อหมวดแล้วกดออกนอกช่อง ระบบจะบันทึกให้อัตโนมัติ</p></div>';
}
async function saveCat(c, msg) {
  try { await api.saveCategory(c); if (msg) toast(msg, "good"); } catch (e) { toast(saveErr(e), "bad"); }
}

/* about & settings drafts */
function ensureDraft() { if (!S.draft) S.draft = { about: clone(SITE.about), settings: clone(SITE.settings) }; return S.draft; }
function saveBar(kind) { return '<div style="display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap"><button class="btn sm" data-a="resetdraft">ยกเลิกการแก้ไข</button><button class="btn sm pri" data-a="save' + kind + '" id="save' + kind + '">' + I.save + "บันทึก</button></div>"; }
function aAboutHtml() {
  const a = ensureDraft().about;
  const rows = (list, key, cls, fields, addLabel) => '<div class="subrows">' + (list || []).map((r, i) =>
      '<div class="subrow ' + cls + '">' + fields.map((f) => '<input class="inp" id="ab-' + key + i + f[0] + '" data-f="about.' + key + "." + i + "." + f[0] + '"' + (f[2] ? ' data-num="1" type="number" min="0" max="100"' : "") + ' value="' + esc(r[f[0]]) + '" placeholder="' + esc(f[1]) + '" aria-label="' + esc(f[1]) + '">').join("") +
      '<button type="button" class="xbtn" data-a="rmrow" data-id="' + key + '" data-i="' + i + '" aria-label="ลบแถว">' + I.x + "</button></div>").join("") +
    '<div><button type="button" class="btn sm" data-a="addrow" data-id="' + key + '">' + I.plus + addLabel + "</button></div></div>";
  return '<div class="panel glass"><div class="ph"><h2>ข้อมูลส่วนตัว</h2><a class="btn sm" href="#about">' + I.eye + 'ดูหน้าเกี่ยวกับฉัน</a></div><div class="form">' +
      '<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap"><div class="avatar" style="width:88px;height:88px;margin:0">' + imgTag(a.avatar || logoUrl(), "") + '</div><div style="display:flex;gap:8px;flex-wrap:wrap"><label class="btn sm" for="f-avatar">' + I.upload + 'เปลี่ยนรูปโปรไฟล์</label><input type="file" id="f-avatar" accept="image/*" hidden>' + (a.avatar ? '<button class="btn sm" data-a="rmavatar">ใช้โลโก้แทน</button>' : "") + '</div></div><div id="s-progress"></div>' +
      '<div class="row2"><div class="field"><label for="ab-name">ชื่อที่แสดง</label><input class="inp" id="ab-name" data-f="about.name" value="' + esc(a.name) + '"></div><div class="field"><label for="ab-role">ตำแหน่ง / สายงาน</label><input class="inp" id="ab-role" data-f="about.role" value="' + esc(a.role) + '"></div></div>' +
      '<div class="field"><label for="ab-bio">เรื่องราวของฉัน</label><textarea class="inp" id="ab-bio" data-f="about.bio" style="min-height:160px">' + esc(a.bio) + "</textarea></div>" +
      '<div class="field"><label for="ab-tools">เครื่องมือที่ใช้</label><input class="inp" id="ab-tools" data-f="about.toolstr" value="' + esc((a.tools || []).join(", ")) + '"><small>คั่นด้วยจุลภาค</small></div></div></div>' +
    '<div class="panel glass"><div class="ph"><h2>ทักษะ</h2><span class="tag">ชื่อทักษะ · ระดับ 0-100</span></div>' + rows(a.skills, "skills", "", [["name", "ชื่อทักษะ"], ["level", "ระดับ %", 1]], "เพิ่มทักษะ") + "</div>" +
    '<div class="panel glass"><div class="ph"><h2>เส้นทาง / ประสบการณ์</h2></div>' + rows(a.timeline, "timeline", "tl3", [["year", "ปี"], ["title", "หัวข้อ"], ["detail", "รายละเอียด"]], "เพิ่มรายการ") + "</div>" +
    '<div class="panel glass"><div class="ph"><h2>ช่องทางติดต่อ</h2></div>' + rows(a.contacts, "contacts", "c3", [["label", "ช่องทาง"], ["value", "ที่อยู่ / ลิงก์"]], "เพิ่มช่องทาง") + '<p class="note">ใส่ลิงก์ที่ขึ้นต้นด้วย https:// เพื่อให้ผู้ชมคลิกเปิดได้ ช่องที่เว้นว่างจะไม่แสดง</p></div>' +
    '<div class="panel glass">' + saveBar("about") + "</div>";
}
function aSettingsHtml() {
  const s = ensureDraft().settings;
  return '<div class="panel glass"><div class="ph"><h2>ข้อมูลเว็บไซต์</h2></div><div class="form">' +
      '<div class="row2"><div class="field"><label for="st-name">ชื่อเว็บไซต์</label><input class="inp" id="st-name" data-f="settings.name" value="' + esc(s.name) + '"></div><div class="field"><label for="st-eyebrow">ข้อความหัวเรื่องเล็ก</label><input class="inp" id="st-eyebrow" data-f="settings.eyebrow" value="' + esc(s.eyebrow) + '"></div></div>' +
      '<div class="field"><label for="st-tag">คำโปรยหน้าแรก</label><textarea class="inp" id="st-tag" data-f="settings.tagline" style="min-height:80px">' + esc(s.tagline) + "</textarea></div>" +
      '<div class="field"><label for="st-foot">ข้อความท้ายเว็บ</label><input class="inp" id="st-foot" data-f="settings.footer" value="' + esc(s.footer) + '"></div>' +
      '<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap"><div class="avatar" style="width:64px;height:64px;margin:0">' + imgTag(s.logo || DEFAULT_LOGO, "") + '</div><label class="btn sm" for="f-logo">' + I.upload + 'เปลี่ยนโลโก้</label><input type="file" id="f-logo" accept="image/*" hidden>' + (s.logo ? '<button class="btn sm" data-a="rmlogo">ใช้โลโก้เดิม</button>' : "") + '</div><div id="s-progress"></div>' +
      '<p class="note">ไอคอนบนแท็บเบราว์เซอร์ (favicon) มาจากไฟล์ assets/favicon.png ใน GitHub ถ้าต้องการเปลี่ยนแบบถาวรให้แทนที่ไฟล์นั้น</p>' +
      saveBar("settings") + "</div></div>" +
    '<div class="panel glass"><div class="ph"><h2>เปลี่ยนรหัสผ่านผู้ดูแล</h2><span class="tag">' + esc(S.email) + '</span></div><form class="form" id="pwf">' +
      '<div class="field"><label for="pw-old">รหัสผ่านปัจจุบัน</label><input class="inp" id="pw-old" type="password" autocomplete="current-password" required></div>' +
      '<div class="row2"><div class="field"><label for="pw-n1">รหัสผ่านใหม่</label><input class="inp" id="pw-n1" type="password" autocomplete="new-password" minlength="6" required></div><div class="field"><label for="pw-n2">ยืนยันรหัสผ่านใหม่</label><input class="inp" id="pw-n2" type="password" autocomplete="new-password" required></div></div>' +
      '<div><button class="btn sm">' + I.lock + "เปลี่ยนรหัสผ่าน</button></div></form></div>";
}

/* ====== visitor tracking ====== */
const T = { q: [], uid: null, off: false };
function hit(kind, key) {
  if (T.off || S.admin) return;
  if (!T.uid) { T.q.push([kind, key]); return; }
  api.track(T.uid, kind, key);
}
function startTracking(uidv) {
  T.uid = uidv;
  if (!store.get("ngj-v", true)) { store.set("ngj-v", "1", true); api.track(uidv, "visit"); }
  const q = T.q; T.q = []; q.forEach(([k, v]) => api.track(uidv, k, v));
}
let unsubVisits = null;
function subscribeVisits() {
  if (unsubVisits || !S.admin) return;
  S.visits = null; S.visitsErr = "";
  unsubVisits = api.watchVisits((list) => { S.visits = list; if (S.route === "admin" && S.atab === "dash") rerenderTab(); },
    () => { S.visitsErr = "อ่านข้อมูลผู้เข้าชมไม่ได้ ตรวจว่าวางกฎ firestore.rules แล้ว"; unsubVisits = null; if (S.atab === "dash") rerenderTab(); });
}

/* ====== render & routing ====== */
function render() {
  const app = $("#app");
  let view;
  if (!api.configured && S.route !== "home" && S.route !== "works" && S.route !== "about") view = setupHtml();
  else view = S.route === "works" ? worksHtml() : S.route === "about" ? aboutHtml() : S.route === "admin" ? adminHtml() : homeHtml();
  if (!api.configured && S.route === "home") view = setupHtml() + view;
  app.innerHTML = navHtml() + '<main class="wrap">' + view + "</main>" + footerHtml();
}
const ROUTES = ["home", "works", "about", "admin"];
function route(fromClick) {
  const h = decodeURIComponent((location.hash || "").slice(1));
  const m = h.match(/^work\/(.+)$/);
  if (m) {
    if (!$("#app").innerHTML) render();
    if (!S.loaded) { S.pendingWork = m[1]; return; }
    const ctx = S.route === "works" ? filteredWorks().map((w) => w.id) : null;
    showWork(m[1], S.viewer ? null : ctx, fromClick);
    return;
  }
  if (S.viewer) { closeModal(); document.title = SITE.settings.name; }
  closeLightbox();
  const r = ROUTES.includes(h) ? h : "home";
  const changed = r !== S.route; S.route = r;
  render(); if (changed) window.scrollTo(0, 0);
  if (r !== "admin") hit("page", r);
  if (r === "admin" && S.admin) subscribeVisits();
}
let clickedWork = false;
window.addEventListener("hashchange", () => { const f = clickedWork; clickedWork = false; route(f); });

/* ====== events ====== */
document.addEventListener("click", (e) => {
  const lbBtn = e.target.closest("[data-lb]");
  if (lbBtn) { const k = lbBtn.getAttribute("data-lb"); if (k === "close") closeLightbox(); if (k === "prev") stepLightbox(-1); if (k === "next") stepLightbox(1); return; }
  if (e.target.id === "lightbox") { closeLightbox(); return; }
  const t = e.target.closest("[data-a]"); if (!t) return;
  const a = t.getAttribute("data-a"), id = t.getAttribute("data-id");
  if (a === "backdrop") { if (e.target === t && !S.edit) { S.viewer ? closeViewer() : closeModal(); } return; }
  if (a === "open") { if (e.metaKey || e.ctrlKey || e.shiftKey) return; clickedWork = true; return; }
  if (t.tagName === "BUTTON" && t.type !== "submit") e.preventDefault();
  switch (a) {
    case "theme": toggleTheme(); break;
    case "close": closeModal(); break;
    case "closeviewer": closeViewer(); break;
    case "prevwork": stepWork(-1); break;
    case "nextwork": stepWork(1); break;
    case "sharelink": copyLink(location.origin + location.pathname + "#work/" + S.viewer.id); break;
    case "sharework": copyLink(location.origin + location.pathname + "#work/" + id); break;
    case "zoom": { const w = S.viewer && workById(S.viewer.id); const list = w && w.kind === "image" && w.images.length ? w.images : [coverUrl(w)]; openLightbox(list, +t.getAttribute("data-i") || 0); break; }
    case "gocat": S.filter = id; S.q = ""; if (S.route === "works") render(); else location.hash = "works"; break;
    case "filter": S.filter = id; render(); break;
    case "copy": copyLink(t.getAttribute("data-v"), "คัดลอกแล้ว"); break;
    case "copycode": { const cb = $("#codeblock"); if (cb) navigator.clipboard.writeText(cb.innerText).then(() => toast("คัดลอกโค้ดแล้ว", "good"), () => toast("คัดลอกไม่สำเร็จ", "bad")); break; }
    case "atab": S.atab = id; store.set("ngj-atab", id, true); render(); if (id === "dash") subscribeVisits(); break;
    case "logout": api.logout().then(() => { toast("ออกจากระบบแล้ว"); location.hash = "home"; }); break;
    case "newwork": openEditor(null); break;
    case "editwork": openEditor(id); break;
    case "feat": { const w = workById(id); if (!w) break; w.featured = !w.featured; rerenderTab(); api.saveWork(w).catch((er) => { w.featured = !w.featured; rerenderTab(); toast(saveErr(er), "bad"); }); break; }
    case "delwork": { const w = workById(id);
      confirmBox('ลบผลงาน "' + (w ? w.title : "") + '" ใช่ไหม ลบแล้วกู้คืนไม่ได้', "ลบผลงาน", async () => {
        try { await api.removeWork(id); SITE.works = SITE.works.filter((x) => x.id !== id); rerenderTab(); toast("ลบผลงานแล้ว"); } catch (er) { toast(saveErr(er), "bad"); } });
      break; }
    case "ekind":
      S.edit.work.kind = id;
      $$('.seg [data-a="ekind"]').forEach((b) => b.classList.toggle("on", b.getAttribute("data-id") === id));
      $$("[data-kinds]", $("#modal-root")).forEach((el) => { el.hidden = !el.getAttribute("data-kinds").split(" ").includes(id); });
      { const h = $("#e-urlhint"); if (h) h.textContent = urlHint(S.edit.work); }
      break;
    case "rmvid": S.edit.work.video = ""; refreshThumbs(); break;
    case "rmimg": S.edit.work.images.splice(+id, 1); refreshThumbs(); break;
    case "rmcover": S.edit.work.cover = ""; refreshThumbs(); break;
    case "rmavatar": ensureDraft().about.avatar = ""; rerenderTab(); break;
    case "rmlogo": ensureDraft().settings.logo = ""; rerenderTab(); break;
    case "nckind": S.newCat.kind = id; S.newCat.name = ($("#nc-name") || {}).value || ""; rerenderTab(); break;
    case "nchue": S.newCat.hue = +id; S.newCat.name = ($("#nc-name") || {}).value || ""; rerenderTab(); break;
    case "ckind": { const c = catById(t.getAttribute("data-c")); if (c) { c.kind = id; rerenderTab(); saveCat(c); } break; }
    case "chue": { const c = catById(t.getAttribute("data-c")); if (c) { c.hue = +id; rerenderTab(); saveCat(c); } break; }
    case "catmove": {
      const i = +id, j = i + (+t.getAttribute("data-d")), cs = SITE.categories;
      if (j < 0 || j >= cs.length) break;
      [cs[i], cs[j]] = [cs[j], cs[i]]; cs.forEach((c, k) => { c.order = k; }); rerenderTab();
      api.saveCategoryOrder(cs).catch((er) => toast(saveErr(er), "bad")); break;
    }
    case "delcat": {
      const cat = catById(id), n = countIn(id);
      confirmBox('ลบหมวด "' + (cat ? cat.name : "") + '" ใช่ไหม' + (n ? " ผลงาน " + n + " ชิ้นในหมวดนี้จะย้ายไปที่ ไม่ระบุหมวด" : ""), "ลบหมวดหมู่", async () => {
        const moved = SITE.works.filter((w) => w.cat === id).map((w) => Object.assign(clone(w), { cat: "" }));
        try {
          await api.removeCategory(id, moved);
          SITE.categories = SITE.categories.filter((c) => c.id !== id);
          moved.forEach((m) => { const w = workById(m.id); if (w) w.cat = ""; });
          if (S.filter === id) S.filter = "all"; rerenderTab(); toast("ลบหมวดหมู่แล้ว");
        } catch (er) { toast(saveErr(er), "bad"); }
      });
      break;
    }
    case "addrow": {
      const d = ensureDraft().about;
      const blank = { skills: { name: "", level: 70 }, timeline: { year: String(new Date().getFullYear()), title: "", detail: "" }, contacts: { label: "", value: "" } }[id];
      d[id] = d[id] || []; d[id].push(blank); rerenderTab();
      const inputs = $$('#amain [data-f^="about.' + id + '."]'); const firstOfLast = inputs.filter((el) => el.getAttribute("data-f").startsWith("about." + id + "." + (d[id].length - 1) + "."))[0];
      if (firstOfLast) firstOfLast.focus();
      break;
    }
    case "rmrow": ensureDraft().about[id].splice(+t.getAttribute("data-i"), 1); rerenderTab(); break;
    case "resetdraft": S.draft = null; rerenderTab(); toast("ยกเลิกการแก้ไขแล้ว"); break;
    case "saveabout": case "savesettings": {
      const d = ensureDraft(), which = a === "saveabout" ? "about" : "settings";
      const btn = $("#save" + which); if (btn) btn.disabled = true;
      (which === "about" ? api.saveAbout(d.about) : api.saveSettings(d.settings)).then(() => {
        SITE[which] = clone(d[which]); toast("บันทึกแล้ว ผู้ชมเห็นได้ทันที", "good"); render();
      }).catch((er) => { if (btn) btn.disabled = false; toast(saveErr(er), "bad"); });
      break;
    }
  }
});
document.addEventListener("keydown", (e) => {
  if (S.lb) { if (e.key === "Escape") closeLightbox(); if (e.key === "ArrowLeft") stepLightbox(-1); if (e.key === "ArrowRight") stepLightbox(1); return; }
  if (S.viewer && !e.target.closest("input,textarea")) { if (e.key === "ArrowLeft") stepWork(-1); if (e.key === "ArrowRight") stepWork(1); if (e.key === "Escape") closeViewer(); return; }
  if (e.key === "Escape" && $("#modal-root").innerHTML) closeModal();
});
document.addEventListener("input", (e) => {
  const t = e.target;
  if (t.id === "q") { S.q = t.value; const g = $("#gridbox"); if (g) g.innerHTML = gridHtml(); return; }
  const f = t.getAttribute && t.getAttribute("data-f");
  if (f) {
    const d = ensureDraft();
    const v = t.getAttribute("data-num") ? Math.max(0, Math.min(100, +t.value || 0)) : t.value;
    if (f === "about.toolstr") d.about.tools = t.value.split(",").map((s) => s.trim()).filter(Boolean);
    else setPath(d, f, v);
    return;
  }
  const ef = t.getAttribute && t.getAttribute("data-e");
  if (ef && S.edit) {
    const w = S.edit.work;
    if (ef === "tagstr") w.tags = t.value.split(",").map((s) => s.trim()).filter(Boolean);
    else setPath(w, ef, t.type === "checkbox" ? t.checked : t.value);
    if (ef === "url") { const h = $("#e-urlhint"); if (h) h.textContent = urlHint(w); }
  }
});
document.addEventListener("change", (e) => {
  const t = e.target;
  if (t.type === "file") { const fl = Array.from(t.files || []); t.value = ""; handleFiles(t.id, fl); return; }
  if (t.getAttribute("data-e") && S.edit) setPath(S.edit.work, t.getAttribute("data-e"), t.type === "checkbox" ? t.checked : t.value);
  const cn = t.getAttribute("data-cname");
  if (cn) { const c = catById(cn); const v = t.value.trim(); if (c && v && v !== c.name) { c.name = v; saveCat(c, "บันทึกชื่อหมวดแล้ว"); } }
});
document.addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.target;
  if (f.id === "loginf") {
    const btn = $("#lbtn"); btn.disabled = true; $("#lerr").textContent = "";
    try { await api.login($("#lu").value, $("#lp").value); toast("ยินดีต้อนรับกลับ", "good"); }
    catch (er) {
      const c = (er && er.code) || "";
      $("#lerr").textContent = c === "auth/too-many-requests" ? "ลองผิดหลายครั้งเกินไป รอสักครู่แล้วลองใหม่" : c === "auth/network-request-failed" ? "เชื่อมต่ออินเทอร์เน็ตไม่ได้" : c === "auth/operation-not-allowed" ? "ยังไม่ได้เปิดการเข้าสู่ระบบแบบ Email/Password ใน Firebase" : "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
      $("#lp").value = ""; $("#lp").focus(); btn.disabled = false;
    }
  }
  if (f.id === "workf") saveEditor();
  if (f.id === "catf") {
    const name = $("#nc-name").value.trim(); if (!name) return;
    if (SITE.categories.some((c) => c.name === name)) { toast("มีหมวดชื่อนี้อยู่แล้ว", "bad"); return; }
    const c = { id: uid("c"), name, kind: S.newCat.kind, hue: S.newCat.hue, order: SITE.categories.length };
    try {
      await api.saveCategory(c); SITE.categories.push(c);
      S.newCat = { name: "", kind: "video", hue: HUES[(HUES.indexOf(S.newCat.hue) + 1) % HUES.length] };
      rerenderTab(); toast('สร้างหมวด "' + name + '" แล้ว', "good");
    } catch (er) { toast(saveErr(er), "bad"); }
  }
  if (f.id === "pwf") {
    const old = $("#pw-old").value, n1 = $("#pw-n1").value, n2 = $("#pw-n2").value;
    if (n1.length < 6) { toast("รหัสผ่านใหม่ต้องยาวอย่างน้อย 6 ตัวอักษร", "bad"); return; }
    if (n1 !== n2) { toast("รหัสผ่านใหม่ทั้งสองช่องไม่ตรงกัน", "bad"); return; }
    try { await api.changePassword(old, n1); f.reset(); toast("เปลี่ยนรหัสผ่านแล้ว", "good"); }
    catch (er) { const c = (er && er.code) || ""; toast(c.includes("wrong-password") || c.includes("invalid-credential") ? "รหัสผ่านปัจจุบันไม่ถูกต้อง" : c.includes("weak-password") ? "รหัสผ่านใหม่ง่ายเกินไป" : "เปลี่ยนรหัสผ่านไม่สำเร็จ (" + c + ")", "bad"); }
  }
});
["dragover", "dragleave", "drop"].forEach((ev) => document.addEventListener(ev, (e) => {
  const d = e.target.closest && e.target.closest(".drop"); if (!d) return;
  e.preventDefault(); d.classList.toggle("over", ev === "dragover");
  if (ev === "drop" && e.dataTransfer && e.dataTransfer.files.length) handleFiles(d.getAttribute("for"), e.dataTransfer.files);
}));

/* ====== theme watcher (no background animation: keeps the page light) ====== */
const field = {
  mount() {
    try { matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { const b = $('[data-a="theme"]'); if (b) b.innerHTML = effTheme() === "dark" ? I.sun : I.moon; }); } catch (e) {}
  },
  recolor() {}
};

/* ====== cursor light: the area under the mouse glows a little brighter ====== */
function spotlight() {
  if (!window.matchMedia || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const SEL = ".card, .cattile, .glass, .search, .fact";
  const glow = document.createElement("div"); glow.id = "cursor-glow"; glow.setAttribute("aria-hidden", "true");
  document.body.prepend(glow);
  let x = 0, y = 0, raf = 0, cur = null;
  const paint = () => {
    raf = 0;
    glow.style.transform = "translate3d(" + x + "px," + y + "px,0)";
    if (cur && cur.isConnected) { const r = cur.getBoundingClientRect(); cur.style.setProperty("--mx", (x - r.left) + "px"); cur.style.setProperty("--my", (y - r.top) + "px"); }
  };
  addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    x = e.clientX; y = e.clientY;
    glow.classList.add("on");
    const t = e.target && e.target.closest ? e.target.closest(SEL) : null;
    if (t !== cur) { if (cur) cur.classList.remove("lit"); cur = t; if (cur) cur.classList.add("lit"); }
    if (!raf) raf = requestAnimationFrame(paint);
  }, { passive: true });
  document.documentElement.addEventListener("mouseleave", () => { glow.classList.remove("on"); if (cur) { cur.classList.remove("lit"); cur = null; } });
}

/* ====== intro (short, CSS-only) ====== */
function intro() {
  if (reduced || store.get("ngj-intro", true) || /^#work\//.test(location.hash)) return;
  store.set("ngj-intro", "1", true);
  const np = nameParts();
  const el = document.createElement("div"); el.id = "intro"; el.setAttribute("aria-hidden", "true");
  el.innerHTML = '<div class="ib"><img src="' + esc(logoUrl()) + '" alt=""><div class="iw"><b>' + esc(np[0].toUpperCase()) + "</b> " + esc(np[1]) + '</div><i class="iline"></i></div>';
  document.body.appendChild(el);
  const done = () => { if (el.classList.contains("out")) return; el.classList.add("out"); setTimeout(() => el.remove(), 500); };
  el.addEventListener("click", done); setTimeout(done, 1300);
}

/* ====== boot ====== */
function applyLoaded(d) {
  if (d.settings) Object.assign(SITE.settings, d.settings);
  if (d.about) Object.assign(SITE.about, d.about);
  if (d.categories.length) SITE.categories = d.categories;
  SITE.works = d.works;
  SITE.seeded = !!d.settings;
  sortCats();
  document.title = SITE.settings.name;
}
async function seedIfNeeded() {
  if (SITE.seeded || !S.admin || !S.loaded || S.loadErr) return;
  try { await api.seed(SITE.settings, SITE.about, SITE.categories); SITE.seeded = true; toast("ตั้งค่าเริ่มต้นของเว็บไซต์ในฐานข้อมูลเรียบร้อย", "good"); } catch (e) {}
}
function boot() {
  const mr = document.createElement("div"); mr.id = "modal-root"; document.body.appendChild(mr);
  const tr = document.createElement("div"); tr.id = "toasts"; tr.setAttribute("role", "status"); tr.setAttribute("aria-live", "polite"); document.body.appendChild(tr);
  field.mount();
  spotlight();
  const h = (location.hash || "").slice(1);
  if (/^work\//.test(h)) { S.route = "works"; render(); }
  route();
  intro();
  if (!api.configured) { S.loaded = true; S.authReady = true; render(); return; }

  api.loadSite().then((d) => { applyLoaded(d); S.loaded = true; })
    .catch((e) => { S.loaded = true; S.loadErr = (e && e.code || "").includes("permission") ? "ฐานข้อมูลปฏิเสธการอ่าน ตรวจว่าวางกฎ firestore.rules แล้ว" : "เชื่อมต่อฐานข้อมูลไม่ได้ ลองรีเฟรชหน้าอีกครั้ง"; })
    .then(() => {
      if (!S.viewer) render();
      if (S.pendingWork) { const id = S.pendingWork; S.pendingWork = null; showWork(id, null, false); }
      seedIfNeeded();
    });

  api.watchAuth((u) => {
    const was = S.admin;
    S.authReady = true; S.admin = u.admin; S.uid = u.uid; S.email = u.email || "";
    if (u.admin) { T.off = true; subscribeVisits(); seedIfNeeded(); }
    else {
      T.off = false;
      if (unsubVisits) { unsubVisits(); unsubVisits = null; }
      S.draft = null;
      if (u.uid) startTracking(u.uid);
    }
    if (S.route === "admin" && was !== S.admin && !S.viewer) render();
    else if (S.route === "admin" && !S.viewer && !$("#amain") && S.admin) render();
    else if (S.route === "admin" && !S.viewer && !S.admin) render();
  });
}
boot();
