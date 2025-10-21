# Account Manager App

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-black.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-brightgreen.svg)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38BDF8.svg)](https://tailwindcss.com/)
[![Lucide React](https://img.shields.io/badge/Lucide--React-icons-blueviolet.svg)](https://lucide.dev/)
[![JWT](https://img.shields.io/badge/JWT-authentication-orange.svg)](https://jwt.io/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED.svg)](https://www.docker.com/)
[![Build with Vite](https://img.shields.io/badge/Built%20With-Vite-facc15.svg)](https://vitejs.dev/)
[![Database](https://img.shields.io/badge/Database-MongoDB-green.svg)](https://www.mongodb.com/)
[![Status](https://img.shields.io/badge/Status-Active-success.svg)](https://github.com/tynnp/account-manager-app)

**Account Manager App** là một ứng dụng quản lý mật khẩu đơn giản cho phép người dùng lưu trữ, thêm/sửa/xóa tài khoản với mật khẩu đa nhãn, phân loại theo loại (banking, social, email, work, other), và ghi chú. Nếu dự án hữu ích, hãy cho một star nhé!

- **Frontend:** React 18 + TypeScript, Vite, Tailwind CSS, Lucide React. Toast notifications qua React Hot Toast.
- **Backend:** Node.js + Express.js, MongoDB + Mongoose, JWT authentication, đăng nhập bằng PIN.
- **Database:** MongoDB lưu users, accounts, passwords. JWT cho auth.
- **Deployment:** Hỗ trợ Docker & Docker Compose.

## Tính năng chính
- Đăng nhập bằng PIN (mặc định: 123456) và đổi PIN.
- Quản lý danh sách tài khoản: thêm, sửa, xóa.
- Hiển thị mật khẩu theo nhãn (label) cho từng tài khoản.
- Toast notifications cho feedback người dùng.
- Responsive UI với Tailwind.

> Lưu ý: Dự án phù hợp học tập/cá nhân, không khuyến nghị dùng cho production mà không thêm mã hóa mạnh (ví dụ bcrypt).

---

## Yêu cầu
- Node.js v18+
- MongoDB v6+
- npm hoặc yarn
- Docker & Docker Compose (tùy chọn)

## Dependencies chính
- **Frontend:** React 18.3.1, TypeScript 5.5.3, Vite 5.4.2, Tailwind CSS 3.4.1, React Hot Toast 2.6.0.
- **Backend:** Express 4.18.2, Mongoose 7.5.0, JSONWebToken 9.0.0, Helmet 7.0.0, CORS 2.8.5.

---

## Cài đặt

### Clone repository
```bash
git clone https://github.com/tynnp/account-manager-app
cd account-manager-app
```

### Cài đặt dependencies
**Frontend**
```bash
cd client
npm install
cd ..
```

**Backend**
```bash
cd server
npm install
cd ..
```

### Setup biến môi trường (.env)
Tạo file `.env` trong `client/` và `server/` dựa trên `.env.example`.

**Client (`client/.env`):**
```
VITE_API_BASE=http://localhost:8386/api
```

**Server (`server/.env`):**
```
PORT=8386
MONGO_URI=mongodb://localhost:27017/passmgr
JWT_SECRET=my_secret_key      # Thay bằng secret mạnh
DEFAULT_PIN=123456            # PIN mặc định
```

> Không commit `.env` vào Git.

### Khởi tạo MongoDB
- Chạy MongoDB local trên port 27017
- Hoặc sử dụng Docker (xem phần Deploy)

---

## Chạy Local

### Backend (dev)
```bash
cd server
npm start
```
Server chạy trên: `http://localhost:8386`

### Frontend (dev)
```bash
cd client
npm run dev
```
App chạy trên: `http://localhost:5173`  
PIN mặc định: `123456`

### Kiểm tra
- Thêm account ví dụ:  
```json
{
  "name": "Google",
  "username": "tynnp.dhsp@google.com",
  "category": "email",
  "passwords": [{ "label": "Main", "value": "pass123" }]
}
```

---

## Production Build (Local)
**Frontend**
```bash
cd client
npm run build
```
Output: `dist/`

**Backend**
```bash
cd server
npm start
```

---

## Deploy với Docker
```bash
docker-compose up --build
```

### Services
- **mongo:** MongoDB container, port 27017, volume `mongo_data`
- **backend:** Node.js backend, port 8386, env từ `server/.env.docker`
- **frontend:** React build, port 6677 → 80, arg `VITE_API_BASE=http://localhost:8386/api`

Truy cập app: `http://localhost:6677`

### Dừng
```bash
docker-compose down
# Xóa volumes nếu cần reset DB
docker-compose down -v
```

> Production: Thay `localhost` trong `VITE_API_BASE` bằng domain thực.

---

## API Endpoints

**Prefix:** `/api`  
**Auth:** Bearer JWT token (trừ login PIN)

### Authentication
| Method | Endpoint | Description | Body/Params | Auth |
|--------|---------|-------------|-------------|------|
| POST   | /auth/login | Đăng nhập bằng PIN | `{ pin: string }` | No |
| POST   | /auth/change-pin | Đổi PIN | `{ oldPin, newPin }` | Yes |

**Response login:**  
```json
{ "token": "<JWT>" }
```

### Accounts
| Method | Endpoint | Description | Body/Params | Auth |
|--------|---------|-------------|-------------|------|
| GET    | /accounts | Lấy danh sách | - | Yes |
| GET    | /accounts/:id | Lấy chi tiết | id (path) | Yes |
| POST   | /accounts | Tạo account | `{ name, username, category, passwords, note? }` | Yes |
| PUT    | /accounts/:id | Cập nhật account | body như POST | Yes |
| DELETE | /accounts/:id | Xóa account | id (path) | Yes |

**Account Schema**
```ts
interface Account {
  _id: string;
  name: string;
  username: string;
  category: 'banking' | 'social' | 'email' | 'work' | 'other';
  passwords: { _id: string; label: string; value: string }[];
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

**Error handling:** `{ message: string }` + status code phù hợp.

---

## Cấu trúc Dự án
```
account-manager-app/
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/  # MainScreen, PinScreen, Modals, Toast
│   │   ├── App.tsx      # Root component
│   │   ├── index.css
│   │   ├── main.tsx
│   │   ├── types.ts
│   ├── package.json
│   └── Dockerfile
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
|   |   ├── server.js
│   │   └── app.js
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml
```

---

## Troubleshooting
- **CORS errors:** Kiểm tra `VITE_API_BASE`
- **DB connection failed:** MongoDB chạy, URI đúng
- **PIN không hoạt động:** Kiểm tra `DEFAULT_PIN`
- **Frontend build lỗi:** Kiểm tra `VITE_API_BASE` ARG trong Docker
- **JWT invalid:** Token hết hạn hoặc secret sai

---

## Giấy phép

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## Đóng góp

Contributions, issues và feature requests đều được chào đón!

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request 

## Liên hệ
Email: [tynnp.dhsp@gmail.com](mailto:tynnp.dhsp@gmail.com)