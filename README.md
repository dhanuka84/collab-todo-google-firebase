# Collaborative Todo Application

A simple Google Keep–style collaborative TODO app.

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Auth & Data: Firebase (Auth + Firestore)
- Deployment: Docker Compose

## Project structure

- `backend/` – Express API server (auth, todos, users)
- `frontend/` – React SPA (login, register, todo board)
- `docker-compose.yml` – Runs frontend + backend locally
- `secrets/firebase-service-account.json` – **Not committed** in real projects; here a placeholder is provided.

## Prerequisites

- Node.js 20+
- Docker & docker-compose
- A Firebase project with:
  - Firebase Authentication (Email/Password enabled)
  - Firestore database
  - A service account key (JSON) for Admin SDK

## Setup

### Install Node.js

Step 1: Activate NVM
Your terminal doesn't know NVM exists yet. Copy and run this command block to load it into your current session (this matches what the log told you to do):

```bash

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

```

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
Step 2: Install the Latest Version
Now that NVM is active, download the latest Node version (v25):

```bash

nvm install node
```

Step 3: Verify
Check that you are now using the new version:


```bash

node -v

```

### 1. Firebase config

1. Create a Firebase project.
2. In *Project settings → Service accounts*, generate a new private key.
3. Save it as:

   ```bash
   secrets/firebase-service-account.json
   ```

4. From *Project settings → General → Your apps (Web)*, copy:
   - API key
   - Auth domain
   - Project ID

### 2. Environment variables

Create `backend/.env`:

```env
PORT=4000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
```

Create `frontend/.env`:

```env
VITE_FIREBASE_API_KEY=your-firebase-web-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_API_BASE_URL=http://localhost:4000
```

### 3. Local (non-docker) dev

From `backend/`:

```bash
npm install
npm run dev
```

From `frontend/`:

```bash
npm install
npm run dev
```



- Backend: http://localhost:4000
- Frontend: http://localhost:5173 (Vite default)

### 4. Docker Compose

From project root:

```bash
docker-compose build
docker-compose up
```

- Backend: http://localhost:4000
- Frontend: http://localhost:3000

## API overview

- `GET /api/todos` – List todos visible to current user
- `POST /api/todos` – Create todo
- `PATCH /api/todos/:id` – Update todo (owner or assignee)
- `DELETE /api/todos/:id` – Delete todo (owner only)
- `GET /api/users` – List users (for assignment UI)

All endpoints require `Authorization: Bearer <Firebase ID token>`.

## Notes

- This is a starter project; you can expand with labels, due dates, real-time updates, etc.
- Do **not** commit the real `firebase-service-account.json` to a public Git repo.
