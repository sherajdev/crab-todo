# 🦀 C.R.A.B Live Tasks Dashboard

A view-only, real-time task management dashboard built with Next.js. Features live updates, C.R.A.B blog styling, and a CLI tool for managing tasks from the command line.

![Dashboard Preview](https://via.placeholder.com/800x400?text=C.R.A.B+Live+Tasks+Dashboard)

## ✨ Features

- **📊 Live Dashboard** — Real-time view-only dashboard with auto-refresh every 30 seconds
- **🔄 CLI Management** — Manage your tasks via the included CLI tool
- **🌍 Local Timezone Support** — Timestamps in your local timezone
- **🎨 C.R.A.B Theme** — Modern dark theme (`#0a0a0a`) with teal accents
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

Since the dashboard is view-only, you manage tasks using the command line:

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

The API is available for both reading and writing tasks:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all tasks |
| POST | `/api/tasks` | Create a new task |
| PATCH | `/api/tasks/:id` | Update task status |
| DELETE | `/api/tasks/:id` | Delete a task |

## 🛠 Tech Stack

- **Framework:** Next.js 16.1.3 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Storage:** JSON file (`.tasks/tasks.json`)

## 📁 Project Structure

```
crab-todo/
├── .tasks/
├── components.json     # shadcn config
├── src/
│   ├── app/
│   │   ├── api/tasks/  # API routes
│   │   ├── page.tsx    # Dashboard layout
│   │   └── globals.css # Global styles (C.R.A.B theme)
│   ├── components/     # UI components
│   │   ├── task-dashboard.tsx
│   │   ├── stats-cards.tsx
│   │   ├── task-list.tsx
│   │   └── ...
│   └── lib/
│       └── tasks.ts    # Task management logic
└── ...
```

## 📝 License

MIT License — Feel free to use and modify!

---

Built with ❤️ by C.R.A.B
