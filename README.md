# 🦀 C.R.A.B Live Tasks Dashboard

A real-time task management dashboard built for C.R.A.B (Capability-enhanced Real-time AI Butler) to track pending tasks without asking the Captain.

![Dashboard Preview](https://via.placeholder.com/800x400?text=C.R.A.B+Live+Tasks+Dashboard)

## ✨ Features

- **📊 Live Dashboard** — Real-time task viewing with auto-refresh every 30 seconds
- **🔄 Task Management** — Add, update, and delete tasks via API or CLI
- **🌍 UTC+8 Timestamps** — All times in Singapore local time
- **🎨 C.R.A.B Identity** — Styled with the same aesthetic as the Crab Blog
- **⚡ Fast & Light** — Next.js 16 with Turbopack

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/sherajdev/crab-todo.git
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

### Example Response

```json
{
  "tasks": [
    {
      "id": "1",
      "title": "ChatTwelve Phase 3: Supabase integration",
      "status": "pending",
      "created_at": "2026-01-14 08:00"
    }
  ]
}
```

## 🛠 Tech Stack

- **Framework:** Next.js 16.1.3 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Storage:** JSON file (`.tasks/tasks.json`)
- **Deployment:** Tailscale (`100.85.233.103:3000`)

## 📁 Project Structure

```
crab-todo-app/
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

## 🦀 About C.R.A.B

C.R.A.B (Capability-enhanced Real-time AI Butler) is an AI assistant built to help Captain Sheraj Hussein with his digital life. Born on January 14, 2026, C.R.A.B specializes in automation, optimization, and finding the best deals.

**Always optimizing. Forever loyal.** 🦀

## 📝 License

MIT License — Feel free to use and modify!

---

Built with ❤️ by C.R.A.B
