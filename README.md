# CVBuilder Backend — Setup Guide

A detailed guide for team members to install and run this codebase on their local machine.

---

## Prerequisites

Make sure the following tools are installed on your machine:

| Tool    | Minimum Version | Download              |
| ------- | --------------- | --------------------- |
| Node.js | v18 or above    | https://nodejs.org    |
| Yarn    | v1.22 or above  | `npm install -g yarn` |
| Git     | Any             | https://git-scm.com   |

Verify your installations:

```bash
node -v
yarn -v
git -v
```

---

## Step 1 — Clone the repository

```bash
git clone <your-repo-url>
cd cv-builder-backend
```

---

## Step 2 — Install dependencies

```bash
yarn install
```

---

## Step 3 — Create the `.env` file

Create a `.env` file at the root of the project. You can copy from the example file:

```bash
# macOS / Linux
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

Then open the `.env` file and fill in the following values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=
CLIENT_URL=http://localhost:3000
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

> ⚠️ **Never commit the `.env` file to GitHub.** It is already added to `.gitignore`. Contact the team lead to get the required values.

---

## Step 4 — Get the MongoDB connection string

This project uses **MongoDB Atlas** (a shared cloud database for the entire team).

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas) and log in with the team account
2. Open the **cv-builder-cluster** → click **"Connect"** → select **"Drivers"**
3. Copy the connection string, it will look like this:
   ```
   mongodb+srv://cvbuilder-admin:<password>@cv-builder-cluster.xxxxxx.mongodb.net/cvbuilder?retryWrites=true&w=majority
   ```
4. Replace `<password>` with the actual password and paste it into `MONGO_URI` in your `.env` file

> Contact the team lead if you do not have access to Atlas yet.

---

## Step 5 — Get the OAuth credentials (optional)

This project uses **JWT** for authentication with optional **Google** and **GitHub** OAuth login.

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services → Credentials**
2. Create an OAuth 2.0 Client ID
3. Set the redirect URI to `http://localhost:5000/api/auth/google/callback`
4. Copy **Client ID** → `GOOGLE_CLIENT_ID` and **Client Secret** → `GOOGLE_CLIENT_SECRET`

### GitHub OAuth
1. Go to [GitHub Settings → Developer Settings → OAuth Apps](https://github.com/settings/developers)
2. Create a new OAuth App with callback URL `http://localhost:5000/api/auth/github/callback`
3. Copy **Client ID** → `GITHUB_CLIENT_ID` and **Client Secret** → `GITHUB_CLIENT_SECRET`

> You can skip this step if you only need email/password login.

---

## Step 6 — Start the server

```bash
yarn dev
```

If everything is set up correctly, you should see:

```
MongoDB connected
Server running on port 5000
```

---

## Step 7 — Verify everything is working

Open your browser and visit the following URLs:

| URL                              | Expected result                          |
| -------------------------------- | ---------------------------------------- |
| `http://localhost:5000/`         | `{"status": "CVBuilder API is running"}` |
| `http://localhost:5000/api-docs` | Swagger UI showing all API endpoints     |

---

## API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint               | Description                   | Auth |
| ------ | ---------------------- | ----------------------------- | ---- |
| POST   | `/api/auth/register`   | Register a new user           | No   |
| POST   | `/api/auth/login`      | Login with email & password   | No   |
| POST   | `/api/auth/refresh`    | Refresh access token          | No   |
| POST   | `/api/auth/logout`     | Logout user                   | No   |
| GET    | `/api/auth/me`         | Get current user              | Yes  |
| GET    | `/api/auth/google`     | Initiate Google OAuth         | No   |
| GET    | `/api/auth/github`     | Initiate GitHub OAuth         | No   |

### CV Management (`/api/cv`)

| Method | Endpoint         | Description                          | Auth |
| ------ | ---------------- | ------------------------------------ | ---- |
| POST   | `/api/cv`        | Create a new CV                      | Yes  |
| GET    | `/api/cv`        | Get all CVs for authenticated user   | Yes  |
| GET    | `/api/cv/:id`    | Get a specific CV by ID              | Yes  |
| PUT    | `/api/cv/:id`    | Update a CV                          | Yes  |
| DELETE | `/api/cv/:id`    | Delete a CV                          | Yes  |

> All CV endpoints include **ownership guards** — users can only access their own CVs.
> Full interactive documentation is available at `/api-docs` (Swagger UI).

---

## Project structure

```
cv-builder-backend/
├── src/
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── passport.js         # Google & GitHub OAuth strategies
│   ├── controllers/
│   │   ├── auth.controller.js  # Auth handler logic
│   │   └── cv.controller.js    # CV CRUD handler logic
│   ├── middlewares/
│   │   └── auth.middleware.js  # JWT Bearer token verification
│   ├── models/
│   │   ├── user.model.js       # User schema
│   │   ├── cv.model.js         # CV schema (with embedded sub-schemas)
│   │   ├── template.model.js   # Template schema
│   │   ├── aiLog.model.js      # AI usage log schema
│   │   └── subscription.model.js
│   ├── routes/
│   │   ├── auth.routes.js      # Auth routes (register, login, OAuth)
│   │   └── cv.routes.js        # CV CRUD routes
│   ├── validations/
│   │   └── cv.validation.js    # Zod schemas & validate middleware
│   ├── scripts/
│   │   ├── seedDummy.js        # Seed database with sample data
│   │   └── syncModels.js       # Sync models to MongoDB
│   ├── utils/
│   │   └── token.util.js       # JWT token generation helpers
│   └── app.js                  # Express app configuration
├── server.js                   # Entry point
├── swagger.js                  # Swagger docs configuration
├── .env                        # Environment variables (DO NOT commit)
├── .env.example                # Example .env file (safe to commit)
└── package.json
```

---

## Common commands

| Command       | Description                                                          |
| ------------- | -------------------------------------------------------------------- |
| `yarn dev`    | Start the server in development mode (auto-restarts on file changes) |
| `yarn start`  | Start the server in production mode                                  |
| `yarn test`   | Run all tests                                                        |
| `yarn lint`   | Check for code style errors                                          |
| `yarn format` | Auto-format all code                                                 |

---

## Tech Stack

| Technology             | Purpose                                 |
| ---------------------- | --------------------------------------- |
| Node.js + Express      | Backend framework                       |
| MongoDB + Mongoose     | Database                                |
| JWT + Passport         | Authentication (local + Google/GitHub OAuth) |
| Swagger (swagger-jsdoc)| API documentation for the frontend team |
| Zod                    | Request body validation                 |
| Multer                 | File uploads                            |
| html-pdf-node          | Export CV to PDF                        |
| Jest + Supertest       | Testing                                 |

---

## Team conventions

- **Never commit the `.env` file** — only commit `.env.example`
- **Never push directly to `main`** — create a new branch for each feature
- **Branch naming** format: `feature/feature-name` or `fix/bug-name`
- **Run `yarn lint` before opening a Pull Request**
- **New API endpoints must have Swagger comments** in the corresponding route file

---

## Troubleshooting

| Error                       | Cause                                   | Fix                                             |
| --------------------------- | --------------------------------------- | ------------------------------------------------ |
| `MongoDB connection failed` | Wrong MONGO_URI or IP not whitelisted   | Check `.env` and Atlas IP Whitelist              |
| `Cannot find module`        | Dependencies not installed              | Run `yarn install`                               |
| `401 Not authorized`        | Missing or invalid JWT token            | Check `JWT_ACCESS_SECRET` in `.env`, re-login    |
| `400 Validation failed`     | Request body doesn't match Zod schema   | Check the error details for which field is wrong |

If you are still having issues, reach out to the team lead directly.
