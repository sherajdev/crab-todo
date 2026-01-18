# C.R.A.B Task Manager CLI

Instructions for using the task.sh script to manage tasks via the D1-powered API.

**Script Location:** `scripts/task.sh`

**Prerequisites:** `curl` and `jq` must be installed.

---

## Commands

| Action | Command | Example |
|--------|---------|---------|
| Check API status | `./task.sh status` | `./task.sh status` |
| List all tasks | `./task.sh list` | `./task.sh list` |
| List pending only | `./task.sh pending` | `./task.sh pending` |
| Add a task | `./task.sh add "title"` | `./task.sh add "Deploy new feature"` |
| Mark as in-progress | `./task.sh progress <id>` | `./task.sh progress 1768750843050` |
| Mark as completed | `./task.sh done <id>` | `./task.sh done 1768750843050` |
| Delete a task | `./task.sh delete <id>` | `./task.sh delete 1768750843050` |

---

## Workflow Example

```bash
# 1. Add a new task
./task.sh add "Implement user authentication"

# 2. Get the task ID from output, then mark as in-progress
./task.sh progress 1768750843050

# 3. When finished, mark as completed
./task.sh done 1768750843050
```

---

## Output Format

| Command | Output |
|---------|--------|
| `list` | `<id> \| <status_icon> <status> \| <title>` |
| `add` | JSON with task object |
| `progress` | JSON with updated task |
| `done` | JSON with updated task |
| `delete` | `{"success": true}` |

---

## Task Statuses

| Status | Icon | Meaning |
|--------|------|---------|
| `pending` | ⏳ | Not started |
| `in-progress` | 🔄 | Currently working |
| `completed` | ✅ | Done |

---

## API Endpoint (Alternative)

If direct HTTP is preferred over the script:

**Base URL:** `https://crab-todo.sheraj.org/api/tasks`

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| GET | `/api/tasks` | - | List all tasks |
| POST | `/api/tasks` | `{"title": "..."}` | Create task |
| PATCH | `/api/tasks/:id` | `{"status": "..."}` | Update task |
| DELETE | `/api/tasks/:id` | - | Delete task |

### Example API Calls

```bash
# List tasks
curl -s https://crab-todo.sheraj.org/api/tasks | jq '.'

# Add task
curl -s -X POST https://crab-todo.sheraj.org/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "New task"}'

# Update status
curl -s -X PATCH https://crab-todo.sheraj.org/api/tasks/123 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'

# Delete task
curl -s -X DELETE https://crab-todo.sheraj.org/api/tasks/123
```

---

## Response Schema

### Task Object

```json
{
  "id": "1768750843050",
  "title": "Task title",
  "status": "pending",
  "created_at": "2026-01-18T15:40:43.127Z",
  "updated_at": "2026-01-18T15:40:43.127Z"
}
```

### List Response

```json
{
  "tasks": [...],
  "count": 7
}
```
