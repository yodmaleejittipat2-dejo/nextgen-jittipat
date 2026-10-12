# NextGen Jittipat — Digital Creative Hub & Showcase

เว็บรวมผลงานวิดีโอ โมชันกราฟิก งานกราฟิก และโปรเจกต์ไอที พร้อมระบบผู้ดูแล

- **หน้าเว็บ** วางบน GitHub Pages (ฟรี)
- **ข้อมูลและระบบเข้าสู่ระบบ** ใช้ Firebase (Authentication + Cloud Firestore) แพ็กเกจฟรี Spark ไม่ต้องผูกบัตร
- **รูปและวิดีโอที่อัปโหลด** เก็บที่ Cloudinary แพ็กเกจฟรี ไม่ต้องผูกบัตร

ทำครั้งเดียวประมาณ 20–30 นาที ทำตามลำดับด้านล่างได้เลย

---

## ขั้นที่ 1 · สร้างโปรเจกต์ Firebase

1. เข้า <https://console.firebase.google.com> แล้วกด **Create a project**
2. ตั้งชื่อ เช่น `nextgen-jittipat` (ปิด Google Analytics ได้ ไม่จำเป็น)
3. ในหน้าโปรเจกต์ กดไอคอน **`</>` (Web)** เพื่อเพิ่มเว็บแอป ตั้งชื่ออะไรก็ได้ ไม่ต้องติ๊ก Firebase Hosting
4. Firebase จะแสดงโค้ด `const firebaseConfig = { ... }` ให้ **คัดลอกค่าเก็บไว้** ใช้ในขั้นที่ 5

## ขั้นที่ 2 · เปิดระบบเข้าสู่ระบบ (Authentication)

1. เมนูซ้าย **Build › Authentication** › กด **Get started**
2. แท็บ **Sign-in method** เปิด 2 อย่าง
   - **Email/Password** › Enable › Save
   - **Anonymous** › Enable › Save (ใช้นับสถิติผู้เข้าชม)
3. แท็บ **Users** › **Add user** ใส่
   - Email: `jittipat_admin@nextgen-jittipat.web`
   - Password: รหัสผ่านที่ต้องการ (อย่างน้อย 6 ตัวอักษร)

   ตอนเข้าสู่ระบบในเว็บ พิมพ์ชื่อผู้ใช้แค่ `jittipat_admin` ได้เลย
4. แนะนำ: แท็บ **Settings › User actions** ให้ **เอาติ๊ก "Enable create (sign-up)" ออก** เพื่อไม่ให้ใครสมัครบัญชีเองได้

## ขั้นที่ 3 · สร้างฐานข้อมูล (Cloud Firestore)

1. เมนูซ้าย **Build › Firestore Database** › **Create database**
2. เลือก Location ใกล้ไทย เช่น `asia-southeast1 (Singapore)` › เลือก **Start in production mode**
3. ไปแท็บ **Rules** ลบของเดิมทั้งหมด แล้ว **วางเนื้อหาจากไฟล์ `firestore.rules`** ในโฟลเดอร์นี้ › กด **Publish**

> กฎนี้ทำให้ทุกคนดูผลงานได้ แต่แก้ไขได้เฉพาะบัญชี `jittipat_admin@nextgen-jittipat.web` เท่านั้น
> ถ้าเปลี่ยนอีเมลผู้ดูแล ต้องแก้อีเมลทั้งใน `firestore.rules` และ `js/config.js` ให้ตรงกัน

## ขั้นที่ 4 · ตั้งค่า Cloudinary (สำหรับอัปโหลดรูปและวิดีโอ)

1. สมัครฟรีที่ <https://cloudinary.com/users/register_free>
2. ในหน้า Dashboard จด **Cloud name** ไว้
3. ไปที่ **Settings (ไอคอนเฟือง) › Upload › Upload presets** › **Add upload preset**
   - **Signing mode: Unsigned** (สำคัญ)
   - **Folder:** `nextgen-jittipat`
   - แนะนำให้จำกัดชนิดไฟล์ที่ **Allowed formats** เช่น `jpg,png,webp,gif,mp4,mov,webm`
   - กด Save แล้วจด **ชื่อ preset** ไว้

> ถ้ายังไม่อยากตั้งค่า Cloudinary ข้ามขั้นนี้ได้ เว็บยังใช้ผลงานแบบลิงก์ YouTube / TikTok / โค้ด ได้ตามปกติ

## ขั้นที่ 5 · ใส่ค่าในไฟล์ `js/config.js`

เปิด `js/config.js` แล้วแทนที่ข้อความ "ใส่ค่า..." ด้วยค่าจริงจากขั้นที่ 1 และ 4 เช่น

```js
export const firebaseConfig = {
  apiKey: "AIzaSy....",
  authDomain: "nextgen-jittipat.firebaseapp.com",
  projectId: "nextgen-jittipat",
  storageBucket: "nextgen-jittipat.firebasestorage.app",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef"
};
export const cloudinary = { cloudName: "ชื่อ cloud ของคุณ", uploadPreset: "ชื่อ preset ของคุณ" };
```

> ค่า `apiKey` ของ Firebase เปิดเผยบน GitHub ได้ ไม่ใช่ความลับ ความปลอดภัยจริงมาจากกฎใน `firestore.rules`
> **ห้าม** ใส่รหัสผ่านผู้ดูแลลงในไฟล์ใดใน GitHub

## ขั้นที่ 6 · อัปโหลดขึ้น GitHub และเปิด GitHub Pages

1. สร้าง repository ใหม่ที่ <https://github.com/new> เช่นชื่อ `nextgen-jittipat` ตั้งเป็น **Public**
2. กด **uploading an existing file** แล้วลากไฟล์และโฟลเดอร์ทั้งหมดในโฟลเดอร์นี้ขึ้นไป (`index.html`, `css`, `js`, `assets`, `.nojekyll` ฯลฯ) › Commit
3. ไปที่ **Settings › Pages** › Source: **Deploy from a branch** › Branch: `main` / `(root)` › Save
4. รอ 1–2 นาที จะได้ลิงก์เว็บ เช่น `https://ชื่อผู้ใช้.github.io/nextgen-jittipat/`

## ขั้นที่ 7 · อนุญาตโดเมนของเว็บใน Firebase

1. Firebase › **Authentication › Settings › Authorized domains** › **Add domain**
2. ใส่ `ชื่อผู้ใช้.github.io` (ไม่ต้องมี https:// และไม่ต้องมีชื่อ repo)

ถ้าไม่ทำขั้นนี้ จะเข้าสู่ระบบผู้ดูแลไม่ได้

## ขั้นที่ 8 · เข้าใช้งานครั้งแรก

1. เปิดเว็บ › กดไอคอนแม่กุญแจ › เข้าสู่ระบบด้วย `jittipat_admin` และรหัสผ่านจากขั้นที่ 2
2. ครั้งแรกระบบจะสร้างหมวดหมู่และข้อมูลเริ่มต้นในฐานข้อมูลให้เอง
3. ไปที่ **ผลงาน › เพิ่มผลงาน** ได้เลย ทุกการบันทึกขึ้นเว็บทันที

---

## ใช้งานประจำวัน

| อยากทำ | ไปที่ |
|---|---|
| เพิ่ม / แก้ / ลบผลงาน | ระบบผู้ดูแล › ผลงาน |
| ส่งลิงก์ผลงานชิ้นเดียวให้คนอื่น | ปุ่ม 🔗 ในรายการผลงาน หรือปุ่ม "คัดลอกลิงก์" ตอนเปิดดูผลงาน |
| สร้างหมวดหมู่ใหม่ | ระบบผู้ดูแล › หมวดหมู่ |
| แก้หน้าเกี่ยวกับฉัน | ระบบผู้ดูแล › เกี่ยวกับฉัน › กดบันทึก |
| ดูสถิติผู้เข้าชม | ระบบผู้ดูแล › แดชบอร์ด |
| เปลี่ยนรหัสผ่าน | ระบบผู้ดูแล › ตั้งค่าเว็บ |

**ลิงก์ผลงานแต่ละชิ้น** มีรูปแบบ `https://.../#work/รหัสผลงาน` เปิดแล้วเด้งไปที่ผลงานนั้นทันที

**ดูผลงานต่อเนื่อง** กดลูกศรซ้าย/ขวา ใช้ปุ่มลูกศรบนคีย์บอร์ด หรือปัดซ้าย/ขวาบนมือถือ

**ขยายรูป** คลิกรูปในงานกราฟิกเพื่อเปิดเต็มจอ คลิกอีกครั้งเพื่อซูม

## ข้อควรรู้

- **คลิป TikTok** ต้องใช้ลิงก์เต็มแบบ `https://www.tiktok.com/@ชื่อ/video/ตัวเลข` ลิงก์ย่อ `vt.tiktok.com` จะเล่นในหน้าเว็บไม่ได้ (เปิดลิงก์ย่อในเบราว์เซอร์ก่อนแล้วคัดลอกลิงก์เต็มมาใช้)
- **วิดีโอที่อัปโหลด** รับไฟล์ไม่เกิน 100 MB คลิปยาวแนะนำลง YouTube แล้วใช้ลิงก์ ประหยัดโควตาฟรีของ Cloudinary
- **ลบผลงานในเว็บ** จะไม่ลบไฟล์ใน Cloudinary ถ้าต้องการพื้นที่คืน ลบได้ที่ Cloudinary › Media Library › โฟลเดอร์ `nextgen-jittipat`
- **สถิติผู้เข้าชม** นับแยกตามอุปกรณ์และเบราว์เซอร์ การเข้าชมของผู้ดูแลไม่นับรวม
- **เปลี่ยนโลโก้บนแท็บเบราว์เซอร์ (favicon)** ให้แทนที่ไฟล์ `assets/favicon.png` ใน GitHub

## โครงสร้างไฟล์

```
index.html          หน้าเว็บหลัก
css/style.css       หน้าตาและธีมสว่าง/มืด
js/config.js        ค่าการเชื่อมต่อ (แก้ไฟล์นี้ไฟล์เดียว)
js/backend.js       ส่วนเชื่อม Firebase และ Cloudinary
js/app.js           ส่วนแสดงผลและระบบผู้ดูแล
assets/             โลโก้และ favicon
firestore.rules     กฎความปลอดภัยของฐานข้อมูล (วางใน Firebase Console)
.nojekyll           ให้ GitHub Pages ส่งไฟล์ตามที่เป็น
```
