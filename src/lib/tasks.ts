import fs from "fs"
import path from "path"

export interface Task {
  id: string
  title: string
  status: "pending" | "in-progress" | "completed"
  created_at: string
}

const TASKS_FILE = path.join(process.cwd(), ".tasks", "tasks.json")

function ensureTasksFile(): void {
  const dir = path.dirname(TASKS_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(TASKS_FILE)) {
    fs.writeFileSync(TASKS_FILE, "[]", "utf-8")
  }
}

function readTasks(): Task[] {
  ensureTasksFile()
  try {
    const data = fs.readFileSync(TASKS_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

function writeTasks(tasks: Task[]): void {
  ensureTasksFile()
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), "utf-8")
}

export function getAllTasks(): Task[] {
  return readTasks().sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export function getTaskById(id: string): Task | undefined {
  const tasks = readTasks()
  return tasks.find((task) => task.id === id)
}

export function createTask(title: string): Task {
  const tasks = readTasks()
  const id = Date.now().toString()
  const task: Task = {
    id,
    title,
    status: "pending",
    created_at: new Date().toISOString(),
  }
  tasks.push(task)
  writeTasks(tasks)
  return task
}

export function updateTask(
  id: string,
  updates: Partial<Pick<Task, "title" | "status">>
): Task | null {
  const tasks = readTasks()
  const index = tasks.findIndex((task) => task.id === id)
  if (index === -1) return null

  tasks[index] = { ...tasks[index], ...updates }
  writeTasks(tasks)
  return tasks[index]
}

export function deleteTask(id: string): boolean {
  const tasks = readTasks()
  const index = tasks.findIndex((task) => task.id === id)
  if (index === -1) return false

  tasks.splice(index, 1)
  writeTasks(tasks)
  return true
}
