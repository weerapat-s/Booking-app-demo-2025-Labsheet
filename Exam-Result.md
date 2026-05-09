# Exam Result — Booking App Demo 2025

## ข้อมูลผู้ส่งงาน

| รายการ | ข้อมูล |
|--------|--------|
| Email | saysufh@gmail.com |
| GitHub Username | weerapat-s |
| วันที่ส่ง | 2026-05-09 |

---

## 1. URLs สำหรับส่งงาน

| รายการ | URL | สถานะ |
|--------|-----|--------|
| GitHub Repository | https://github.com/weerapat-s/Booking-app-demo-2025-Labsheet | ✅ Public |
| Production Frontend | https://booking-app-demo-2025-azure.vercel.app | ✅ READY |
| Production Backend | https://restaurant-management-system-exam-2025-1.onrender.com/api/health | ⏳ กำลัง deploy |

---

## 2. รายละเอียดโปรเจกต์

**ชื่อโปรเจกต์:** Hotel Booking Management System  
**Repository:** [Booking-app-demo-2025-Labsheet](https://github.com/weerapat-s/Booking-app-demo-2025-Labsheet)  
**จำนวน Commits:** 65 commits

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, React Router v7 |
| Backend | Node.js, Express 5, Prisma ORM |
| Database | PostgreSQL (Docker container) |
| Authentication | JWT (JSON Web Token) |
| Testing | Newman (API), Robot Framework (UI) |
| CI/CD | GitHub Actions |
| Deployment | Vercel (frontend), Render (backend) |

---

## 3. Features

### Public Features
- จองห้องพักผ่านหน้าเว็บ (ไม่ต้อง login)
- ดูข้อมูลห้องพักและราคา
- หน้ายืนยันการจอง

### Admin Features
- ระบบ Login / Register ด้วย JWT
- จัดการการจอง (CRUD)
- จัดการห้องพัก (CRUD) — Admin only
- ออกรายงานและ Export CSV/JSON
- Role-based Access Control (User / Admin)

### Frontend Components
| Component | หน้าที่ |
|-----------|---------|
| `Login.jsx` | หน้าล็อกอิน |
| `Register.jsx` | หน้าสมัครสมาชิก |
| `BookingForm.jsx` | ฟอร์มจองห้องพัก (Public) |
| `BookingList.jsx` | รายการการจองทั้งหมด |
| `BookingCreate.jsx` | สร้างการจองใหม่ (Admin) |
| `BookingEdit.jsx` | แก้ไขการจอง |
| `AdminDashboard.jsx` | หน้าหลัก Admin |
| `AdminLayout.jsx` | Layout สำหรับ Admin |
| `RoomsManagement.jsx` | จัดการห้องพัก |
| `Reports.jsx` | รายงานการจอง |
| `ProtectedRoute.jsx` | Guard route สำหรับ Admin |

---

## 4. API Endpoints

| Method | Endpoint | Auth | คำอธิบาย |
|--------|----------|------|----------|
| POST | `/api/login` | - | เข้าสู่ระบบ |
| POST | `/api/register` | - | สมัครสมาชิก |
| GET | `/api/bookings` | JWT | ดูรายการจองทั้งหมด |
| POST | `/api/bookings` | - | สร้างการจองใหม่ |
| PUT | `/api/bookings/:id` | JWT | แก้ไขการจอง |
| DELETE | `/api/bookings/:id` | JWT | ลบการจอง |
| GET | `/api/rooms` | - | ดูรายการห้องพัก |
| POST | `/api/rooms` | JWT + Admin | เพิ่มห้องพัก |
| PUT | `/api/rooms/:id` | JWT + Admin | แก้ไขห้องพัก |
| DELETE | `/api/rooms/:id` | JWT + Admin | ลบห้องพัก |
| GET | `/api/reports` | JWT | ดูรายงาน |
| GET | `/api/reports/export` | JWT | Export CSV/JSON |
| GET | `/api/health` | - | Health check |

---

## 5. การ Deploy

### Frontend — Vercel
- Framework: Vite
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable: `VITE_API_URL=https://booking-app-demo-2025-labsheet.onrender.com`

### Backend — Render
- Runtime: Node.js
- Root Directory: `backend`
- Build Command: `npm install && npx prisma generate`
- Start Command: `npm start`
- Environment Variables:
  ```
  DATABASE_URL=postgresql://...
  JWT_SECRET=...
  NODE_ENV=production
  ```

---

## 6. สถานะ Checklist

### โครงสร้างโปรเจกต์
- [x] Frontend (React + Vite + Tailwind)
- [x] Backend (Node.js + Express + Prisma)
- [x] Database Schema (PostgreSQL)
- [x] JWT Authentication
- [x] Role-based Access Control
- [x] Health Check Endpoint (`/api/health`)
- [x] Docker Compose (local DB)
- [x] README.md ครบถ้วน

### GitHub
- [x] Repository Public
- [x] โค้ดครบถ้วนบน `main` branch
- [x] 65 commits

### Deployment
- [ ] Frontend deploy บน Vercel
- [ ] Backend deploy บน Render
- [ ] Database (PostgreSQL) บน Render
- [ ] Environment Variables ตั้งค่าถูกต้อง
- [ ] ทดสอบ `/api/health` ตอบ `{"status":"ok"}`
- [ ] ทดสอบ Frontend เชื่อมต่อ Backend ได้
