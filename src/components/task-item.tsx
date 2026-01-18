"use client"

import { useState } from "react"
import type { Task } from "@/lib/tasks"

interface TaskItemProps {
  task: Task
  onUpdate: (id: string, updates: { status?: string; title?: string }) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30" },
  "in-progress": { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
  completed: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" },
}

export function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isLoading, setIsLoading] = useState(false)

  const colors = statusColors[task.status]

  const handleStatusChange = async (newStatus: Task["status"]) => {
    setIsLoading(true)
    await onUpdate(task.id, { status: newStatus })
    setIsLoading(false)
  }

  const handleDelete = async () => {
    setIsLoading(true)
    await onDelete(task.id)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-CA", {
      timeZone: "Asia/Singapore",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).replace(",", "")
  }

  return (
    <div
      className={`bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between group ${isLoading ? "opacity-50 pointer-events-none" : ""
        }`}
    >
      <div className="flex-1 min-w-0">
        <p className={`text-lg ${task.status === "completed" ? "line-through text-gray-500" : "text-white"}`}>
          {task.title}
        </p>
        <p className="text-gray-500 text-sm">{formatDate(task.created_at)}</p>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`px-3 py-1 rounded-full text-sm border ${colors.bg} ${colors.text} ${colors.border}`}
        >
          {task.status}
        </span>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {task.status !== "in-progress" && (
            <button
              onClick={() => handleStatusChange("in-progress")}
              className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 px-3 py-1 rounded text-sm transition-colors"
              title="Mark as In Progress"
            >
              ▶️
            </button>
          )}
          {task.status !== "completed" && (
            <button
              onClick={() => handleStatusChange("completed")}
              className="bg-green-500/20 hover:bg-green-500/40 text-green-400 px-3 py-1 rounded text-sm transition-colors"
              title="Mark as Completed"
            >
              ✅
            </button>
          )}
          <button
            onClick={handleDelete}
            className="bg-red-500/20 hover:bg-red-500/40 text-red-400 px-3 py-1 rounded text-sm transition-colors"
            title="Delete Task"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}
