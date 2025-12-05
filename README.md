# Collaborative Keep-like Todo App

A simple Google Keep style collaborative TODO app.

- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express, TypeScript
- Auth: Firebase Authentication (Email/Password)
- Data: Firestore via Firebase Admin SDK
- Deployment: Docker Compose

## Features

- User registration and login.
- Sticky note style TODOs shown as cards in a grid.
- Each note can be plain text or a checklist.
- Optional color and labels on each note.
- Ownership and collaboration:
  - Owner can see, edit, assign and delete a note.
  - Assignees can see and edit but cannot delete or change assignments.
- Notes are visible only to the owner and assignees.

## Project structure

- backend/  Express API server
- frontend/ React single page app
- docker-compose.yml  Local multi container setup
- Makefile  Development helpers
- secrets/firebase-service-account.json  Service account for Firebase Admin (do not commit real file)

## Environment setup

You need:

- Node.js 18 or later
- Docker and docker compose
- A Firebase project with:
  - Authentication enabled (Email/Password)
  - Firestore database
  - A service account key for Admin SDK

### Backend environment

Create backend/.env

PORT=4000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com

### Frontend environment

Create frontend/.env

VITE_FIREBASE_API_KEY=your-web-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_API_BASE_URL=http://localhost:4000

### Firebase service account

Download a Firebase service account JSON and put it at:

secrets/firebase-service-account.json

Never commit the real file to a public Git repository.

## Local development without Docker

Backend:

cd backend
npm install
npm run dev

Frontend:

cd frontend
npm install
npm run dev


Backend will run on http://localhost:4000
Frontend will run on http://localhost:5173

## Running with Docker Compose

From the project root:

docker-compose build
docker-compose up

Frontend will be available on http://localhost:3000
Backend will be available on http://localhost:4000

## API overview

All endpoints require Authorization: Bearer <Firebase ID token>.

GET /api/todos
  List notes where current user is visibleTo.

POST /api/todos
  Create a new note.

PATCH /api/todos/:id
  Update an existing note (owner or assignee).

DELETE /api/todos/:id
  Delete a note (owner only).

GET /api/users
  List users for assignment.

See source for full details.

<img width="2478" height="978" alt="image" src="https://github.com/user-attachments/assets/609bc9ac-8ec6-4400-9ce0-ceca0899dcef" />




