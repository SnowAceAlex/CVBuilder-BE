# Backend Team Task Assignments & Suggestions

## 🚀 Task 1: Core CV Management (CRUD APIs)

**Priority:** 🔥 High (Core Feature)
**Suggested Deadline:** 1 Week
**Estimated Effort:** 3-5 days

**Description:**
The main feature of your app is building CVs. This task involves creating the controllers, services, and routes to manage user CVs using the existing `cv.model.js`.

**Action Items:**

- Implement `POST /api/cv` (Create a new CV, with references to a chosen template).
- Implement `GET /api/cv` (Get all CVs for the authenticated user).
- Implement `GET /api/cv/:id` (Get details of a specific CV).
- Implement `PUT /api/cv/:id` (Update CV content - e.g., experience, education, skills).
- Implement `DELETE /api/cv/:id` (Delete a CV).
- **Validation:** Add Joi or Zod validation to ensure the submitted CV data matches the schema.

**Acceptance Criteria:**

- [ ] Users can successfully create, read, update, and delete their own CVs.
- [ ] Users _cannot_ access or modify CVs belonging to other users.
- [ ] Swagger API documentation is updated for all new endpoints.

---

## 🚀 Task 2: CV Sub-Resource CRUD (Section Endpoints)

**Priority:** 🔥 High (Depends on Task 1)
**Suggested Deadline:** 1 Week
**Estimated Effort:** 3-5 days

**Description:**
Task 1 đã tạo CV cơ bản (chỉ có `cvTitle`, `templateId`, `personalInfo`). Các mảng `educations`, `experiences`, `skills`, `projects`, `certifications` đang trống khi tạo CV. Task này implement các endpoint riêng để **thêm/sửa/xóa từng entry** trong mỗi section, thay vì gửi toàn bộ CV data trong 1 PUT request.

**Flow hoạt động:**
1. User tạo CV bằng `POST /api/cv` (chỉ có title + personal info)
2. User thêm từng education/experience/skill/... bằng các endpoint bên dưới
3. Frontend gọi API cho từng thao tác → không mất dữ liệu, dễ tích hợp

**Action Items:**

### Personal Info
- Implement `PUT /api/cv/:id/personal-info` — Cập nhật thông tin cá nhân (fullName, email, phone, address, jobTitle, summary)

### Educations (CRUD từng entry)
- Implement `POST /api/cv/:id/educations` — Thêm 1 education entry vào mảng `educations`
- Implement `PUT /api/cv/:id/educations/:eduId` — Sửa 1 education entry theo `_id`
- Implement `DELETE /api/cv/:id/educations/:eduId` — Xóa 1 education entry theo `_id`

### Experiences (CRUD từng entry)
- Implement `POST /api/cv/:id/experiences` — Thêm 1 experience entry
- Implement `PUT /api/cv/:id/experiences/:expId` — Sửa 1 experience entry
- Implement `DELETE /api/cv/:id/experiences/:expId` — Xóa 1 experience entry

### Skills (CRUD từng entry)
- Implement `POST /api/cv/:id/skills` — Thêm 1 skill entry
- Implement `PUT /api/cv/:id/skills/:skillId` — Sửa 1 skill entry
- Implement `DELETE /api/cv/:id/skills/:skillId` — Xóa 1 skill entry

### Projects (CRUD từng entry)
- Implement `POST /api/cv/:id/projects` — Thêm 1 project entry
- Implement `PUT /api/cv/:id/projects/:projectId` — Sửa 1 project entry
- Implement `DELETE /api/cv/:id/projects/:projectId` — Xóa 1 project entry

### Certifications (CRUD từng entry)
- Implement `POST /api/cv/:id/certifications` — Thêm 1 certification entry
- Implement `PUT /api/cv/:id/certifications/:certId` — Sửa 1 certification entry
- Implement `DELETE /api/cv/:id/certifications/:certId` — Xóa 1 certification entry

### Sections (Thứ tự hiển thị)
- Implement `PUT /api/cv/:id/sections` — Cập nhật thứ tự sections (cho drag-and-drop trên frontend)

**Hướng dẫn implement:**

1. **Tất cả endpoint đều cần `protect` middleware** (đã có sẵn ở `auth.middleware.js`)
2. **Ownership guard**: Luôn check `cv.userId === req.user._id` trước khi thao tác. Xem ví dụ ở `getCVById` trong `cv.controller.js`
3. **Pattern chung cho POST (thêm entry):**
   ```js
   // Tìm CV → check ownership → push entry vào mảng → save
   const cv = await CV.findById(req.params.id);
   if (!cv || cv.userId.toString() !== req.user._id.toString()) {
     return res.status(404).json({ success: false, message: 'CV not found' });
   }
   cv.educations.push(req.body);
   await cv.save();
   ```
4. **Pattern chung cho PUT (sửa entry):**
   ```js
   // Tìm CV → check ownership → tìm sub-document bằng .id() → update fields → save
   const education = cv.educations.id(req.params.eduId);
   if (!education) return res.status(404).json(...);
   Object.assign(education, req.body);
   await cv.save();
   ```
5. **Pattern chung cho DELETE (xóa entry):**
   ```js
   // Tìm CV → check ownership → pull entry ra khỏi mảng → save
   cv.educations.pull(req.params.eduId);
   await cv.save();
   ```
6. **Validation**: Dùng Zod (đã setup sẵn ở `validations/cv.validation.js`). Tạo schema riêng cho từng sub-resource
7. **Swagger docs**: Thêm JSDoc annotation cho mỗi route (xem ví dụ ở `cv.routes.js`)

**Acceptance Criteria:**

- [ ] User có thể thêm/sửa/xóa từng education, experience, skill, project, certification
- [ ] User chỉ thao tác được trên CV của chính mình
- [ ] Dữ liệu được validate bằng Zod trước khi lưu
- [ ] Swagger API documentation được cập nhật cho tất cả endpoints mới
- [ ] Sections ordering hoạt động cho drag-and-drop

---

## 🚀 Task 3: AI Enhancer & Generation Service

**Priority:** ⭐ High (Key Selling Point)
**Suggested Deadline:** 1.5 Weeks
**Estimated Effort:** 4-6 days

**Description:**
Since you have an `aiLog.model.js`, your app clearly relies on AI. This member should integrate the backend with an AI API (like OpenAI or Google Gemini) to generate or improve CV text (e.g., summary, experience bullets).

**Action Items:**

- Setup connection with OpenAI/Gemini API using a service layer.
- Create an endpoint `POST /api/ai/enhance` (Takes draft text and returns polished, professional CV text).
- Create an endpoint `POST /api/ai/generate-summary` (Takes user info and generates a professional summary).
- **Logging:** Every API hit should create a record using `aiLog.model.js` to track user usage and limit API abuse.

**Acceptance Criteria:**

- [ ] AI Service can successfully receive prompts and return optimized text.
- [ ] Every AI request successfully saves a log entry to the database.
- [ ] Rate-limiting is applied so users don't exhaust the AI API credits.

---

## 🚀 Task 4: Template Management & Default Seeders

**Priority:** 🟡 Medium
**Suggested Deadline:** 3-4 Days
**Estimated Effort:** 2-3 days

**Description:**
Users need templates to build their CVs. This task involves managing these templates using `template.model.js`.

**Action Items:**

- Implement `GET /api/templates` (List all active templates, with pagination).
- Implement `GET /api/templates/:id` (Get a specific template's details).
- Update the `seedDummy.js` script to populate the database with a few attractive initial templates (JSON structures or HTML/CSS placeholders) so the frontend has data to work with.

**Acceptance Criteria:**

- [ ] Frontend can successfully fetch a list of available templates.
- [ ] Database is seeded with at least 3 default templates.

---

## 🚀 Task 5: User Profile & Account Settings

**Priority:** 🟡 Medium
**Suggested Deadline:** 3 Days
**Estimated Effort:** 2-3 days

**Description:**
While the other member does OAuth, this member can handle standard profile management using `user.model.js`.

**Action Items:**

- Implement `GET /api/users/profile` (Get current user data).
- Implement `PUT /api/users/profile` (Update name, avatar, phone number).
- Implement `PUT /api/users/change-password` (Allow local users to change passwords).
- Add Multer/Cloudinary setup if the user profile requires an Avatar upload.

**Acceptance Criteria:**

- [ ] Users can view and update their profile details.
- [ ] Passwords can be changed securely (with old password verification).

---

## 🚀 Task 6: PDF Export / Generation Service

**Priority:** 🔵 Medium-Low (Future feature, but complex)
**Suggested Deadline:** 2 Weeks (Can be assigned later)
**Estimated Effort:** 5-7 days

**Description:**
A CV builder _must_ be able to export CVs to PDF. This usually involves using a tool like `Puppeteer` or `pdfkit` to convert HTML/JSON to a downloadable PDF file.

**Action Items:**

- Create an endpoint `GET /api/cv/:id/export/pdf`.
- Render the CV data into an HTML template, then convert to PDF buffer.
- Return the PDF buffer to the client with `Content-Type: application/pdf`.

**Acceptance Criteria:**

- [ ] A well-formatted PDF file is successfully generated and downloaded when the endpoint is called.

### How to use this document:

1. Review the tasks with the team member.
2. Ask them to pick **Task 2** and break it down into smaller PRs (e.g., educations first, then skills/projects/certifications).
3. Set a strict deadline (e.g., next Friday) for them to demonstrate the working APIs via Postman/Swagger.
