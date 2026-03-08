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

## 🚀 Task 2: AI Enhancer & Generation Service

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

## 🚀 Task 3: Template Management & Default Seeders

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

## 🚀 Task 4: User Profile & Account Settings

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

## 🚀 Task 5: PDF Export / Generation Service

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
2. Ask them to pick **Task 1** and break it down into smaller PRs (e.g., Create/Read first, Update/Delete second).
3. Set a strict deadline (e.g., next Friday) for them to demonstrate the working APIs via Postman/Swagger.
