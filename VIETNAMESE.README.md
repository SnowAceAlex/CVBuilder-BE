# CVBuilder Backend — Setup Guide

Hướng dẫn chi tiết để các thành viên trong team có thể cài đặt và chạy codebase này trên máy cá nhân.

---

## Yêu cầu trước khi bắt đầu

Đảm bảo máy bạn đã cài đặt các công cụ sau:

| Công cụ | Phiên bản tối thiểu | Link tải              |
| ------- | ------------------- | --------------------- |
| Node.js | v18 trở lên         | https://nodejs.org    |
| Yarn    | v1.22 trở lên       | `npm install -g yarn` |
| Git     | Bất kỳ              | https://git-scm.com   |

Kiểm tra bằng lệnh:

```bash
node -v
yarn -v
git -v
```

---

## Bước 1 — Clone repository

```bash
git clone <your-repo-url>
cd cv-builder-backend
```

---

## Bước 2 — Cài đặt dependencies

```bash
yarn install
```

---

## Bước 3 — Tạo file `.env`

Tạo file `.env` ở thư mục gốc của project. Bạn có thể copy từ file mẫu:

```bash
# macOS / Linux
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

Sau đó mở file `.env` và điền các giá trị sau:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=
CLIENT_URL=http://localhost:3000
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
```

> ⚠️ **Không bao giờ commit file `.env` lên GitHub.** File này đã được thêm vào `.gitignore`. Liên hệ team lead để lấy các giá trị cần thiết.

---

## Bước 4 — Lấy MongoDB connection string

Project này sử dụng **MongoDB Atlas** (cloud database dùng chung cho cả team).

1. Truy cập [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas) và đăng nhập bằng tài khoản team
2. Vào cluster **cv-builder-cluster** → click **"Connect"** → chọn **"Drivers"**
3. Copy connection string, nó sẽ có dạng:
   ```
   mongodb+srv://cvbuilder-admin:<password>@cv-builder-cluster.xxxxxx.mongodb.net/cvbuilder?retryWrites=true&w=majority
   ```
4. Thay `<password>` bằng password thật và paste vào `MONGO_URI` trong file `.env`

> Liên hệ team lead nếu bạn chưa có quyền truy cập vào Atlas.

---

## Bước 5 — Lấy Clerk API Keys

Project sử dụng **Clerk** để xác thực người dùng.

1. Truy cập [clerk.com](https://clerk.com) và đăng nhập bằng tài khoản team
2. Chọn application **cv-builder**
3. Vào **Configure → API Keys**
4. Copy **Publishable Key** (bắt đầu bằng `pk_test_...`) vào `CLERK_PUBLISHABLE_KEY`
5. Copy **Secret Key** (bắt đầu bằng `sk_test_...`) vào `CLERK_SECRET_KEY`

---

## Bước 6 — Setup Webhook (chỉ cần khi test tính năng đăng ký user)

Webhook dùng để tự động tạo user trong MongoDB khi có người đăng ký qua Clerk. Bạn **chỉ cần làm bước này** nếu đang test tính năng liên quan đến auth/user.

### 6.1 — Cài đặt và cấu hình ngrok

Tải ngrok tại [ngrok.com/download](https://ngrok.com/download), giải nén và di chuyển `ngrok.exe` vào `C:\ngrok\`.

Thêm `C:\ngrok` vào **System PATH**:

- Nhấn **Windows + S** → tìm **"Environment Variables"**
- **System variables → Path → New** → thêm `C:\ngrok`
- Bấm OK để lưu

Mở PowerShell mới và kết nối tài khoản ngrok (lấy token tại [dashboard.ngrok.com](https://dashboard.ngrok.com)):

```powershell
ngrok config add-authtoken your_token_here
```

### 6.2 — Chạy ngrok

Mở một cửa sổ PowerShell **riêng** và chạy:

```powershell
ngrok http 5000
```

Copy URL public có dạng `https://abc123.ngrok-free.app`.

### 6.3 — Cập nhật webhook URL trên Clerk

1. Vào Clerk dashboard → **Configure → Webhooks**
2. Click vào endpoint hiện có → **Edit**
3. Cập nhật URL thành:
   ```
   https://abc123.ngrok-free.app/api/webhooks
   ```
4. Copy **Signing Secret** (bắt đầu bằng `whsec_...`) → paste vào `CLERK_WEBHOOK_SECRET` trong `.env`

> ⚠️ **Lưu ý:** Mỗi lần restart ngrok sẽ tạo ra URL mới, bạn cần cập nhật lại URL trên Clerk dashboard.

---

## Bước 7 — Chạy server

```bash
yarn dev
```

Nếu mọi thứ đúng, bạn sẽ thấy:

```
MongoDB connected
Server running on port 5000
```

---

## Bước 8 — Kiểm tra hoạt động

Mở browser và truy cập các URL sau:

| URL                              | Kết quả mong đợi                         |
| -------------------------------- | ---------------------------------------- |
| `http://localhost:5000/`         | `{"status": "CVBuilder API is running"}` |
| `http://localhost:5000/api-docs` | Swagger UI hiển thị tất cả API endpoints |

---

## Cấu trúc project

```
cv-builder-backend/
├── src/
│   ├── config/
│   │   └── db.js               # Kết nối MongoDB
│   ├── controllers/            # Xử lý logic của từng route
│   ├── middlewares/
│   │   └── auth.middleware.js  # Xác thực Clerk JWT
│   ├── models/
│   │   └── user.model.js       # Schema MongoDB cho User
│   ├── routes/
│   │   ├── auth.routes.js      # Routes liên quan đến auth
│   │   ├── cv.routes.js        # Routes liên quan đến CV
│   │   └── webhook.routes.js   # Nhận webhook từ Clerk
│   ├── services/               # Business logic
│   ├── utils/                  # Helper functions
│   └── app.js                  # Cấu hình Express app
├── tests/                      # Unit và integration tests
├── server.js                   # Entry point
├── swagger.js                  # Cấu hình Swagger docs
├── .env                        # Biến môi trường (KHÔNG commit)
├── .env.example                # Mẫu file .env (được commit)
└── package.json
```

---

## Các lệnh thường dùng

| Lệnh          | Mô tả                                                         |
| ------------- | ------------------------------------------------------------- |
| `yarn dev`    | Chạy server ở chế độ development (tự restart khi có thay đổi) |
| `yarn start`  | Chạy server ở chế độ production                               |
| `yarn test`   | Chạy toàn bộ test                                             |
| `yarn lint`   | Kiểm tra lỗi code style                                       |
| `yarn format` | Tự động format code                                           |

---

## Tech Stack

| Công nghệ          | Mục đích                   |
| ------------------ | -------------------------- |
| Node.js + Express  | Framework backend          |
| MongoDB + Mongoose | Database                   |
| Clerk              | Xác thực người dùng (auth) |
| Swagger            | Tài liệu API cho frontend  |
| Zod                | Validation dữ liệu         |
| Multer             | Upload file                |
| html-pdf-node      | Xuất CV ra PDF             |
| Jest + Supertest   | Testing                    |

---

## Quy tắc làm việc trong team

- **Không commit file `.env`** — chỉ commit `.env.example`
- **Không push thẳng lên `main`** — tạo branch mới cho mỗi feature
- **Đặt tên branch** theo format: `feature/ten-chuc-nang` hoặc `fix/ten-loi`
- **Chạy `yarn lint` trước khi tạo Pull Request**
- **API mới phải có Swagger comment** trong file route tương ứng

---

## Gặp vấn đề?

| Lỗi                         | Nguyên nhân                           | Cách fix                                  |
| --------------------------- | ------------------------------------- | ----------------------------------------- |
| `MongoDB connection failed` | Sai MONGO_URI hoặc chưa whitelist IP  | Kiểm tra `.env` và Atlas IP Whitelist     |
| `Cannot find module`        | Chưa chạy `yarn install`              | Chạy `yarn install`                       |
| `401 Unauthenticated`       | Thiếu hoặc sai Clerk token            | Kiểm tra `CLERK_SECRET_KEY` trong `.env`  |
| Webhook trả về 404          | Sai URL webhook                       | Đảm bảo URL kết thúc bằng `/api/webhooks` |
| Webhook trả về 500          | ngrok không chạy hoặc server chưa bật | Bật ngrok và server trước khi test        |

Nếu vẫn gặp vấn đề, hãy hỏi trực tiếp team lead.
