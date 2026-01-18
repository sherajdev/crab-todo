# 🦀 Live Tasks Dashboard

A real-time task management dashboard built with Next.js. Features live updates, clean UI, and a CLI tool for managing tasks from the command line.

![Dashboard Preview](https://via.placeholder.com/800x400?text=Live+Tasks+Dashboard)

## ✨ Features

- **📊 Live Dashboard** — Real-time task viewing with auto-refresh every 30 seconds
- **🔄 Task Management** — Add, update, and delete tasks via API or CLI
- **🌍 Local Timezone Support** — Timestamps in your local timezone
- **🎨 Clean UI** — Modern dark theme with status badges
- **⚡ Fast & Light** — Next.js 16 with Turbopack

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/yourusername/crab-todo.git
cd crab-todo

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 📋 CLI Usage

Manage tasks from the command line:

```bash
# Add a new task
./scripts/task.sh add "Deploy new feature"

# List all tasks
./scripts/task.sh list

# List pending tasks only
./scripts/task.sh pending

# Mark task as in-progress
./scripts/task.sh progress <task_id>

# Mark task as completed
./scripts/task.sh done <task_id>

# Delete a task
./scripts/task.sh delete <task_id>
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all tasks |
| POST | `/api/tasks` | Create a new task |
| PATCH | `/api/tasks/:id` | Update task status |
| DELETE | `/api/tasks/:id` | Delete a task |

### Example Request

**Create a task:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Build a new feature"}'
```

**Example Response:**
```json
{
  "task": {
    "id": "1234567890",
    "title": "Build a new feature",
    "status": "pending",
    "created_at": "2026-01-18 14:44"
  }
}
```

## 🛠 Tech Stack

- **Framework:** Next.js 16.1.3 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Storage:** JSON file (`.tasks/tasks.json`)

## 📁 Project Structure

```
crab-todo/
├── .tasks/
│   └── tasks.json          # Task storage
├── scripts/
│   └── task.sh             # CLI tool
├── src/
│   ├── app/
│   │   ├── api/tasks/      # API routes
│   │   ├── page.tsx        # Dashboard UI
│   │   └── globals.css     # Global styles
│   └── ...
├── package.json
└── README.md
```

## 🎯 Status Badges

| Status | Color |
|--------|-------|
| Pending | 🟡 Yellow |
| In Progress | 🔵 Blue |
| Completed | 🟢 Green |

## 🎨 Customization

### Change the Title

Edit `src/app/page.tsx`:
```tsx
<h1 className="text-3xl font-bold text-gradient mb-2">Your Project Name</h1>
```

### Change the Emoji

Edit `src/app/page.tsx`:
```tsx
<div className="text-6xl mb-4">🚀</div>
```

### Add New Status Types

1. Update the TypeScript interface in `src/app/page.tsx`
2. Add colors to `statusColors` object
3. Update CLI script in `scripts/task.sh`

## 📝 License

MIT License — Feel free to use and modify!

---

Built with ❤️
