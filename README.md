# 📋 Mini Task Manager

A full-stack task management application built with Next.js, Express, TypeScript, MongoDB, and TailwindCSS.

---

## 🏗️ Architecture & Technology Decisions

### Why This Stack?

| Technology | Role | Why This Choice |
|---|---|---|
| **Next.js (App Router)** | Frontend framework | Server components + client components in one framework; file-based routing is intuitive; built-in TypeScript support |
| **TypeScript** | Type safety | Catches bugs at compile time instead of runtime; makes refactoring safer; better IDE support |
| **Express.js** | Backend API | Minimal, unopinionated, battle-tested; huge ecosystem; easy to understand request-response cycle |
| **MongoDB** | Database | Document model fits task objects naturally; flexible schema for future additions; great Node.js integration via Mongoose |
| **Mongoose** | ODM | Schema validation on top of MongoDB; prevents bad data from entering the DB; convenient query API |
| **TailwindCSS** | Styling | Utility-first = no context switching between CSS files; responsive design built in; consistent design system |
| **CORS** | Security | Required to allow browser requests from a different origin (port 3000 → 5000) |
| **dotenv** | Config management | Keeps secrets out of code; makes the app configurable per environment |

### Why Separate Frontend and Backend?

This is a **decoupled** (or "headless") architecture:
- The backend is a pure JSON API — it doesn't know or care about the UI
- The frontend consumes the API — it could be replaced with a mobile app
- Each can be deployed, scaled, and updated independently
- In production: frontend on Vercel, backend on Railway/Render/Heroku

### Folder Structure Explained

```
mini-task-manager/
├── frontend/                    # Next.js App
│   ├── app/
│   │   ├── layout.tsx           # Root HTML shell, global fonts, metadata
│   │   ├── page.tsx             # Homepage "/" — owns all task state
│   │   └── globals.css          # Tailwind directives + base styles
│   ├── components/
│   │   ├── TaskInput.tsx        # "Add task" form — handles local form state
│   │   ├── TaskItem.tsx         # Single task row — renders one task
│   │   └── TaskList.tsx         # Task list — filtering tabs + empty states
│   ├── lib/
│   │   └── api.ts               # All fetch() calls to the backend live here
│   ├── types/
│   │   └── task.ts              # TypeScript interfaces shared across components
│   └── .env.local               # NEXT_PUBLIC_API_URL (gitignored)
│
└── backend/                     # Express API
    ├── src/
    │   ├── config/
    │   │   └── database.ts      # MongoDB connection logic
    │   ├── models/
    │   │   └── Task.ts          # Mongoose schema + model definition
    │   ├── controllers/
    │   │   └── taskController.ts # Business logic for each endpoint
    │   ├── routes/
    │   │   └── taskRoutes.ts    # URL → controller function mapping
    │   ├── middleware/
    │   │   └── errorHandler.ts  # Centralized 404 + error handling
    │   └── index.ts             # App entry point: middleware, routes, server start
    ├── tsconfig.json            # TypeScript compiler configuration
    ├── .env.example             # Template for required environment variables
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher — [Download](https://nodejs.org/)
- **MongoDB** — either:
  - [MongoDB Community](https://www.mongodb.com/try/download/community) (local install)
  - [MongoDB Atlas](https://www.mongodb.com/atlas) (free cloud tier)
- **Git** — [Download](https://git-scm.com/)

### Installation

**1. Clone the repo**
```bash
git clone <your-repo-url>
cd mini-task-manager
```

**2. Set up the backend**
```bash
cd backend

# Install dependencies
npm install

# Create your .env file from the template
cp .env.example .env

# Edit .env with your MongoDB connection string
# If using local MongoDB: MONGODB_URI=mongodb://localhost:27017/mini-task-manager
# If using Atlas: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/tasks
nano .env
```

**3. Set up the frontend**
```bash
cd ../frontend

# Install dependencies
npm install

# Create .env.local (already pre-filled for local dev)
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
```

### Running the App

You need **two terminals** running simultaneously:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# → Server running on http://localhost:5000
# → MongoDB Connected: localhost
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# → Next.js running on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description | Body | Response |
|---|---|---|---|---|
| `GET` | `/tasks` | Get all tasks | None | `{ success, count, data: Task[] }` |
| `POST` | `/tasks` | Create a task | `{ "title": "string" }` | `{ success, data: Task }` |
| `PATCH` | `/tasks/:id` | Toggle completed | None | `{ success, data: Task }` |
| `DELETE` | `/tasks/:id` | Delete a task | None | `{ success, data: { id } }` |
| `GET` | `/health` | Health check | None | `{ success, timestamp }` |

### Task Object Shape

```json
{
  "_id": "664a1234abcd5678ef901234",
  "title": "Buy groceries",
  "completed": false,
  "createdAt": "2024-05-20T10:30:00.000Z",
  "updatedAt": "2024-05-20T10:30:00.000Z"
}
```

### Test the API with curl

```bash
# Create a task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy milk"}'

# Get all tasks
curl http://localhost:5000/api/tasks

# Toggle a task (replace :id with real _id from above)
curl -X PATCH http://localhost:5000/api/tasks/:id

# Delete a task
curl -X DELETE http://localhost:5000/api/tasks/:id
```

---

## 📝 Git Commit Guide (Minimum 8 Commits)

Follow **Conventional Commits** format: `type(scope): description`

Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `style`, `test`

```bash
# Commit 1 — Project initialization
git init
git add .gitignore
git commit -m "chore: initialize project with .gitignore"

# Commit 2 — Backend foundation
git add backend/package.json backend/tsconfig.json backend/.env.example
git commit -m "chore(backend): initialize Express + TypeScript project"

# Commit 3 — Database layer
git add backend/src/config/ backend/src/models/
git commit -m "feat(backend): add MongoDB connection and Task model"

# Commit 4 — API routes
git add backend/src/controllers/ backend/src/routes/ backend/src/middleware/
git commit -m "feat(backend): implement CRUD routes for tasks"

# Commit 5 — Server entry point
git add backend/src/index.ts
git commit -m "feat(backend): configure Express server with CORS and middleware"

# Commit 6 — Frontend foundation
git add frontend/
git commit -m "chore(frontend): initialize Next.js App Router with TypeScript and Tailwind"

# Commit 7 — Types and API layer
git add frontend/types/ frontend/lib/
git commit -m "feat(frontend): add TypeScript types and API service layer"

# Commit 8 — UI components
git add frontend/components/ frontend/app/
git commit -m "feat(frontend): build task manager UI with TaskInput, TaskItem, TaskList"

# Commit 9 — Documentation
git add README.md
git commit -m "docs: add comprehensive README with setup and architecture guide"
```

---

## 🧠 Key Concepts Explained

### What is REST?
REST (Representational State Transfer) is a convention for designing APIs:
- Use HTTP methods to express the action (GET=read, POST=create, PATCH=update, DELETE=remove)
- Use URL paths to identify the resource (`/tasks`, `/tasks/:id`)
- Return consistent JSON responses

### What is a Middleware?
A function that runs between the incoming request and the outgoing response:
```
Request → cors() → express.json() → route handler → errorHandler → Response
```
Each middleware calls `next()` to pass control to the next one.

### What is CORS?
Cross-Origin Resource Sharing. Browsers block JavaScript from making requests to a different domain/port for security. CORS headers tell the browser "this cross-origin request is allowed."

### What is useState?
React's hook for component-level state. When you call the setter, React re-renders the component with the new value. Always use the setter — never mutate state directly.

### What is useEffect?
Runs *after* render. Used for side effects that shouldn't happen during render: API calls, subscriptions, timers. The dependency array controls when it re-runs.

### Why does MongoDB use `_id` instead of `id`?
MongoDB auto-generates a unique `_id` field (ObjectId type) for every document. It starts with `_` by convention. Mongoose serializes it as a string in JSON responses.

---

## 🛠️ Development Commands

```bash
# Backend
npm run dev      # Start with hot reload (nodemon + tsx)
npm run build    # Compile TypeScript → JavaScript
npm run start    # Run compiled JavaScript

# Frontend
npm run dev      # Start Next.js dev server with hot reload
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🔮 Possible Improvements

- **Authentication**: Add JWT-based user accounts so each user has their own tasks
- **Due dates**: Add a `dueDate` field to the Task model and sort by urgency
- **Categories/Tags**: Group tasks by project or label
- **Drag to reorder**: Add `position` field and drag-and-drop reordering
- **Real-time updates**: Use WebSockets to see tasks update across multiple browser tabs
- **Unit tests**: Add Jest + Supertest for backend, Vitest + Testing Library for frontend
- **Docker**: Containerize with docker-compose for one-command startup
