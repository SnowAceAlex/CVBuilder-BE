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
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
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

## Step 5 — Get the Clerk API Keys

This project uses **Clerk** for user authentication.

1. Go to [clerk.com](https://clerk.com) and log in with the team account
2. Select the **cv-builder** application
3. Navigate to **Configure → API Keys**
4. Copy the **Publishable Key** (starts with `pk_test_...`) → paste into `CLERK_PUBLISHABLE_KEY`
5. Copy the **Secret Key** (starts with `sk_test_...`) → paste into `CLERK_SECRET_KEY`

---

## Step 6 — Setup Webhook (only needed when testing user registration)

The webhook automatically creates a user in MongoDB whenever someone signs up through Clerk. You **only need this step** if you are working on features related to auth or user management.

### 6.1 — Install and configure ngrok

Download ngrok at [ngrok.com/download](https://ngrok.com/download), extract the zip, and move `ngrok.exe` to `C:\ngrok\`.

Add `C:\ngrok` to your **System PATH**:

- Press **Windows + S** → search **"Environment Variables"**
- **System variables → Path → New** → add `C:\ngrok`
- Click OK to save

Open a new PowerShell window and authenticate ngrok (get your token at [dashboard.ngrok.com](https://dashboard.ngrok.com)):

```powershell
ngrok config add-authtoken your_token_here
```

### 6.2 — Run ngrok

Open a **separate** PowerShell window and run:

```powershell
ngrok http 5000
```

Copy the public URL that looks like `https://abc123.ngrok-free.app`.

### 6.3 — Update the webhook URL on Clerk

1. Go to Clerk dashboard → **Configure → Webhooks**
2. Click the existing endpoint → **Edit**
3. Update the URL to:
   ```
   https://abc123.ngrok-free.app/api/webhooks
   ```
4. Copy the **Signing Secret** (starts with `whsec_...`) → paste into `CLERK_WEBHOOK_SECRET` in your `.env`

> ⚠️ **Note:** Every time you restart ngrok it generates a new URL. You will need to update the webhook URL on the Clerk dashboard each time.

---

## Step 7 — Start the server

```bash
yarn dev
```

If everything is set up correctly, you should see:

```
MongoDB connected
Server running on port 5000
```

---

## Step 8 — Verify everything is working

Open your browser and visit the following URLs:

| URL                              | Expected result                          |
| -------------------------------- | ---------------------------------------- |
| `http://localhost:5000/`         | `{"status": "CVBuilder API is running"}` |
| `http://localhost:5000/api-docs` | Swagger UI showing all API endpoints     |

---

## Project structure

```
cv-builder-backend/
├── src/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/            # Route handler logic
│   ├── middlewares/
│   │   └── auth.middleware.js  # Clerk JWT verification
│   ├── models/
│   │   └── user.model.js       # MongoDB User schema
│   ├── routes/
│   │   ├── auth.routes.js      # Auth-related routes
│   │   ├── cv.routes.js        # CV-related routes
│   │   └── webhook.routes.js   # Receives webhooks from Clerk
│   ├── services/               # Business logic
│   ├── utils/                  # Helper functions
│   └── app.js                  # Express app configuration
├── tests/                      # Unit and integration tests
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

| Technology         | Purpose                                 |
| ------------------ | --------------------------------------- |
| Node.js + Express  | Backend framework                       |
| MongoDB + Mongoose | Database                                |
| Clerk              | User authentication                     |
| Swagger            | API documentation for the frontend team |
| Zod                | Data validation                         |
| Multer             | File uploads                            |
| html-pdf-node      | Export CV to PDF                        |
| Jest + Supertest   | Testing                                 |

---

## Team conventions

- **Never commit the `.env` file** — only commit `.env.example`
- **Never push directly to `main`** — create a new branch for each feature
- **Branch naming** format: `feature/feature-name` or `fix/bug-name`
- **Run `yarn lint` before opening a Pull Request**
- **New API endpoints must have Swagger comments** in the corresponding route file

---

## Troubleshooting

| Error                       | Cause                                   | Fix                                         |
| --------------------------- | --------------------------------------- | ------------------------------------------- |
| `MongoDB connection failed` | Wrong MONGO_URI or IP not whitelisted   | Check `.env` and Atlas IP Whitelist         |
| `Cannot find module`        | Dependencies not installed              | Run `yarn install`                          |
| `401 Unauthenticated`       | Missing or invalid Clerk token          | Check `CLERK_SECRET_KEY` in `.env`          |
| Webhook returns 404         | Wrong webhook URL                       | Make sure the URL ends with `/api/webhooks` |
| Webhook returns 500         | ngrok not running or server not started | Start both ngrok and the server first       |

If you are still having issues, reach out to the team lead directly.
