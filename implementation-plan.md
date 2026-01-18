# Real-Time Todo App with Cloudflare D1

**Implementation Plan**

**Date:** 2026-01-18
**Author:** C.R.A.B
**Status:** Deployed (Phase 4 pending)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         C.R.A.B Workspace                            │
│  ┌─────────────┐                                                     │
│  │ CLI Tool    │───▶ POST/PATCH/DELETE /api/tasks/*                  │
│  │ (task.sh)   │     (Real-time, instant sync)                       │
│  └─────────────┘                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                │ HTTPS
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Cloudflare Infrastructure                        │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Cloudflare Pages + Pages Functions                            │  │
│  │                                                               │  │
│  │  Endpoints:                                                   │  │
│  │  ├── GET    /api/tasks          → List all tasks            │  │
│  │  ├── POST   /api/tasks          → Create new task           │  │
│  │  ├── PATCH  /api/tasks/:id      → Update task status        │  │
│  │  └── DELETE /api/tasks/:id      → Delete task               │  │
│  │                                                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│                              ▼                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ D1 Database (SQLite)                                          │  │
│  │  Table: tasks                                                 │  │
│  │  Columns: id, title, status, created_at, updated_at           │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Frontend (Pages)                                              │  │
│  │  ├── Dynamic rendering (no static export)                     │  │
│  │  ├── SWR for auto-refresh (30s interval)                     │  │
│  │  └── View-only (no add/edit/delete buttons)                   │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Flow

```
C.R.A.B CLI                              Frontend
    │                                        │
    │  POST /api/tasks                       │  GET /api/tasks
    │  {"title": "Task", "status": "pending"}│
    │ ──────────────────────────────────────▶│
    │                                        │
    │                               D1 Insert
    │                                        │
    │                                        │◀─ SWR Refresh (30s)
    │                                        │
    │                                        ▼
    │                                 Updated Task List
```

---

## 3. D1 Database Schema

### 3.1 Table Definition

```sql
-- File: schema.sql

-- Main tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('pending', 'in-progress', 'completed')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_created ON tasks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_id ON tasks(id);

-- Triggers for automatic updated_at
CREATE TRIGGER IF NOT EXISTS update_tasks_timestamp
AFTER UPDATE ON tasks
FOR EACH ROW
BEGIN
    UPDATE tasks SET updated_at = datetime('now') WHERE id = OLD.id;
END;
```

### 3.2 Seed Data (Optional)

```sql
-- File: seed.sql

INSERT INTO tasks (id, title, status, created_at) VALUES
('1', 'Welcome to Real-Time Todo App', 'pending', datetime('now')),
('2', 'Tasks sync instantly from C.R.A.B CLI', 'in-progress', datetime('now')),
('3', 'Cloudflare D1 powers the backend', 'completed', datetime('now'));
```

---

## 4. API Endpoints

### 4.1 GET /api/tasks

**Description:** List all tasks, ordered by creation date

**Request:**
```http
GET /api/tasks
```

**Response:**
```json
{
  "tasks": [
    {
      "id": "1",
      "title": "Welcome to Real-Time Todo App",
      "status": "pending",
      "created_at": "2026-01-18T12:00:00Z",
      "updated_at": "2026-01-18T12:00:00Z"
    }
  ],
  "count": 3
}
```

**D1 Query:**
```sql
SELECT * FROM tasks ORDER BY created_at DESC;
```

---

### 4.2 POST /api/tasks

**Description:** Create a new task

**Request:**
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "New task name",
  "status": "pending"
}
```

**Response:**
```json
{
  "task": {
    "id": "1705591200000",
    "title": "New task name",
    "status": "pending",
    "created_at": "2026-01-18T12:00:00Z"
  }
}
```

**D1 Query:**
```sql
INSERT INTO tasks (id, title, status, created_at)
VALUES (?, ?, ?, datetime('now'));
```

**Validation:**
- `title` must not be empty
- `status` must be one of: pending, in-progress, completed

---

### 4.3 PATCH /api/tasks/:id

**Description:** Update task status or title

**Request:**
```http
PATCH /api/tasks/1705591200000
Content-Type: application/json

{
  "status": "completed"
}
```

**Response:**
```json
{
  "task": {
    "id": "1705591200000",
    "title": "Task name",
    "status": "completed",
    "updated_at": "2026-01-18T12:05:00Z"
  }
}
```

**D1 Query:**
```sql
UPDATE tasks 
SET status = ?, updated_at = datetime('now')
WHERE id = ?;
```

---

### 4.4 DELETE /api/tasks/:id

**Description:** Delete a task

**Request:**
```http
DELETE /api/tasks/1705591200000
```

**Response:**
```json
{
  "success": true
}
```

**D1 Query:**
```sql
DELETE FROM tasks WHERE id = ?;
```

---

## 5. CLI Tool Changes

### 5.1 Updated Commands

**File:** `scripts/task.sh`

```bash
# Add task (sends to D1 API)
./task.sh add "Deploy blog"

# List tasks (reads from D1 API)
./task.sh list

# Pending tasks (reads from D1 API)
./task.sh pending

# Update status (sends to D1 API)
./task.sh done 1705591200000
./task.sh progress 1705591200000

# Delete task (sends to D1 API)
./task.sh delete 1705591200000

# Sync status (check if D1 is reachable)
./task.sh status
```

### 5.2 API Base URL

```bash
API_URL="https://crab-todo.sheraj.org/api/tasks"
```

### 5.3 Implementation Examples

**Add Task:**
```bash
./scripts/task.sh add "Deploy blog"
```
```bash
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"title":"Deploy blog","status":"pending"}'
```

**Update Status:**
```bash
./scripts/task.sh done 1705591200000
```
```bash
curl -X PATCH "$API_URL/1705591200000" \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'
```

**Delete Task:**
```bash
./scripts/task.sh delete 1705591200000
```
```bash
curl -X DELETE "$API_URL/1705591200000"
```

---

## 6. Frontend Changes

### 6.1 Dynamic Rendering (No Static Export)

**File:** `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // REMOVE: output: 'export'
  // Keep default behavior for dynamic API
};

export default nextConfig;
```

### 6.2 Fetch from D1 API

**File:** `src/components/task-dashboard.tsx`

```typescript
const fetcher = (url: string) => 
  fetch(url).then((res) => res.json());

export function TaskDashboard() {
  const { data, mutate, isValidating } = useSWR<{ tasks: Task[] }>(
    "/api/tasks",
    fetcher,
    {
      refreshInterval: 30000,  // Auto-refresh every 30s
      revalidateOnFocus: true,
    }
  );
  
  // ... rest of component
}
```

### 6.3 API Routes (Pages Functions)

**File:** `src/app/api/tasks/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

// GET /api/tasks
export async function GET() {
  const { results } = await env.DB.prepare(
    "SELECT * FROM tasks ORDER BY created_at DESC"
  ).all();
  
  return NextResponse.json({ 
    tasks: results,
    count: results.length 
  });
}

// POST /api/tasks
export async function POST(request: NextRequest) {
  const { title, status = 'pending' } = await request.json();
  
  const id = Date.now().toString();
  
  await env.DB.prepare(
    "INSERT INTO tasks (id, title, status, created_at) VALUES (?, ?, ?, datetime('now'))"
  ).bind(id, title, status).run();
  
  return NextResponse.json({ 
    task: { id, title, status, created_at: new Date().toISOString() } 
  }, { status: 201 });
}
```

**File:** `src/app/api/tasks/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

// PATCH /api/tasks/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status, title } = await request.json();
  
  if (status) {
    await env.DB.prepare(
      "UPDATE tasks SET status = ?, updated_at = datetime('now') WHERE id = ?"
    ).bind(status, id).run();
  }
  
  if (title) {
    await env.DB.prepare(
      "UPDATE tasks SET title = ?, updated_at = datetime('now') WHERE id = ?"
    ).bind(title, id).run();
  }
  
  return NextResponse.json({ success: true });
}

// DELETE /api/tasks/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  await env.DB.prepare(
    "DELETE FROM tasks WHERE id = ?"
  ).bind(id).run();
  
  return NextResponse.json({ success: true });
}
```

### 6.4 Environment Variables

**File:** `wrangler.toml`

```toml
name = "crab-todo"
compatibility_date = "2026-01-18"

[vars]
NEXT_PUBLIC_API_URL = "/api/tasks"

[[d1_databases]]
binding = "DB"
database_name = "crab-todo-db"
database_id = "YOUR_D1_DATABASE_ID"
```

---

## 7. Setup Instructions

### 7.1 Create D1 Database

```bash
# Create D1 database
npx wrangler d1 create crab-todo-db

# Save the database_id for wrangler.toml
```

### 7.2 Apply Schema

```bash
# Apply schema to local D1 (for testing)
npx wrangler d1 execute crab-todo-db --local --file=./schema.sql

# Apply schema to production D1
npx wrangler d1 execute crab-todo-db --remote --file=./schema.sql
```

### 7.3 Deploy to Cloudflare Pages

```bash
# Deploy to Pages
npx wrangler pages deploy .next --project-name=crab-todo

# Or connect to GitHub for auto-deploy
npx wrangler pages project create crab-todo --production-branch=main
```

### 7.4 Configure Custom Domain

```bash
# Add custom domain
npx wrangler pages domain crab-todo.sheraj.org --project=crab-todo
```

---

## 8. Implementation Checklist

### Phase 1: Database Setup
- [x] Create D1 database
- [x] Apply schema.sql
- [x] Apply seed.sql (optional)
- [x] Test queries locally

### Phase 2: API Development
- [x] Create GET /api/tasks endpoint
- [x] Create POST /api/tasks endpoint
- [x] Create PATCH /api/tasks/:id endpoint
- [x] Create DELETE /api/tasks/:id endpoint
- [x] Test all endpoints

### Phase 3: Frontend Update
- [x] Remove static export from next.config.ts
- [x] Update fetch to use D1 API
- [x] Keep view-only UI
- [x] Test auto-refresh

### Phase 4: CLI Update
- [ ] Update task.sh to call D1 API
- [ ] Change API_URL to production URL
- [ ] Test all commands

### Phase 5: Deployment
- [x] Deploy to Cloudflare Pages
- [x] Configure @cloudflare/next-on-pages adapter
- [x] Configure D1 database binding
- [x] Test end-to-end flow
- [ ] Configure custom domain (optional)

---

## 9. File Structure

```
crab-todo/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── tasks/
│   │   │       ├── route.ts          # GET, POST
│   │   │       └── [id]/
│   │   │           └── route.ts      # PATCH, DELETE
│   │   ├── components/
│   │   │   └── task-dashboard.tsx    # Frontend component
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/
│       └── tasks.ts                  # Type definitions
├── schema.sql                        # D1 schema
├── seed.sql                          # Initial data
├── wrangler.toml                     # Cloudflare config
├── next.config.ts                    # Next.js config
├── package.json
└── README.md
```

---

## 10. Benefits of This Architecture

| Benefit | Description |
|---------|-------------|
| **Real-time sync** | Tasks appear instantly after CLI command |
| **No sync delays** | No 10-minute cron wait |
| **Minimal API calls** | Only when tasks change (not periodic) |
| **Scalable** | D1 handles thousands of queries |
| **Persistent** | Data survives server restarts |
| **Type-safe** | TypeScript throughout |

---

## 11. Estimated API Calls Per Day

| Activity | Calls |
|----------|-------|
| Add 5 tasks | 5 |
| Complete 3 tasks | 3 |
| Delete 1 task | 1 |
| Frontend refreshes (30s) | 2,880 (but these are lightweight) |
| **Total meaningful calls** | **~9** ✅ |

---

## 12. Next Steps

1. ~~Captain reviews this plan~~ ✅
2. ~~Approve implementation~~ ✅
3. ~~Start with D1 database setup~~ ✅
4. ~~Build API endpoints~~ ✅
5. ~~Update frontend~~ ✅
6. ~~Deploy and test~~ ✅
7. Update CLI tool (task.sh) to use production API URL
8. Configure custom domain (optional)

---

*Plan created by C.R.A.B — Always optimizing. Forever loyal.* 🦀
