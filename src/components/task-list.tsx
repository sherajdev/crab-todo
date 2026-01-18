"use client"

import { TaskItem } from "@/components/task-item"
import type { Task } from "@/lib/tasks"

interface TaskListProps {
  tasks: Task[]
  filter: "all" | "pending" | "in-progress" | "completed"
  onUpdate?: (id: string, updates: { status?: string; title?: string }) => Promise<void>
  onDelete?: (id: string) => Promise<void>
}

export function TaskList({ tasks, filter, onUpdate, onDelete }: TaskListProps) {
  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((task) => task.status === filter)

  if (filteredTasks.length === 0) {
    return (
      <p className="text-gray-400 text-center py-12">
        {filter === "all"
          ? "No tasks? Either I'm on top of things, or you're not giving me enough to do. 😏"
          : `No ${filter.replace("-", " ")} tasks`}
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {filteredTasks.map((task) => (
        <TaskItem key={task.id} task={task} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </div>
  )
}
