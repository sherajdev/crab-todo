# C.R.A.B Live Tasks Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-deployed-F38020?logo=cloudflare)](https://pages.cloudflare.com/)
[![Cloudflare D1](https://img.shields.io/badge/Cloudflare_D1-database-F38020?logo=cloudflare)](https://developers.cloudflare.com/d1/)

A view-only, real-time task management dashboard. Watch tasks update live as they're managed by the Clawdbot AI Agent.

**Live Site:** [https://crab-todo.sheraj.org](https://crab-todo.sheraj.org)

---

## Clawdbot AI Agent

This dashboard is designed to work with **[Clawdbot](https://clawd.bot)** — an AI agent that manages tasks autonomously. The dashboard provides a real-time view of tasks as they are created, updated, and completed by the agent.

- **View-only interface** — No manual task editing; all changes come from the AI agent
- **Real-time updates** — Dashboard auto-refreshes every 30 seconds
- **Live monitoring** — Watch the AI agent's progress in real-time

---

## Features

- **Live Dashboard** — Real-time view-only dashboard with auto-refresh
- **Task Statistics** — Visual breakdown of pending, in-progress, and completed tasks
- **C.R.A.B Theme** — Modern dark theme (`#0a0a0a`) with teal accents
- **Edge-powered** — Fast API responses via Cloudflare Workers

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 15.5.2 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 + shadcn/ui |
| **Database** | Cloudflare D1 (SQLite) |
| **Hosting** | Cloudflare Pages |
| **Runtime** | Edge Runtime |

## API Endpoints

The API powers the dashboard and is called by the Clawdbot agent:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all tasks |
| POST | `/api/tasks` | Create a new task |
| PATCH | `/api/tasks/:id` | Update task status |
| DELETE | `/api/tasks/:id` | Delete a task |

## Local Development

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

## Project Structure

```
crab-todo/
├── src/
│   ├── app/
│   │   ├── api/tasks/       # Edge API routes (D1)
│   │   ├── page.tsx         # Dashboard page
│   │   └── globals.css      # C.R.A.B theme
│   ├── components/          # UI components
│   │   ├── task-dashboard.tsx
│   │   ├── stats-cards.tsx
│   │   └── task-list.tsx
│   └── lib/
│       └── tasks.ts         # Task type definitions
├── schema.sql               # D1 database schema
├── wrangler.toml            # Cloudflare config
└── env.d.ts                 # Cloudflare type definitions
```

## License

MIT License — Feel free to use and modify!

---

Built with C.R.A.B — *Always optimizing. Forever loyal.*
