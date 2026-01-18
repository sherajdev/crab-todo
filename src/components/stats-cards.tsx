"use client"

import type { Task } from "@/lib/tasks"

interface StatsCardsProps {
  tasks: Task[]
}

export function StatsCards({ tasks }: StatsCardsProps) {
  const pending = tasks.filter((t) => t.status === "pending").length
  const inProgress = tasks.filter((t) => t.status === "in-progress").length
  const completed = tasks.filter((t) => t.status === "completed").length

  return (
    <div className="flex gap-4 flex-wrap mb-8">
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-5 py-3">
        <span className="text-yellow-400 font-bold text-2xl">{pending}</span>
        <span className="text-gray-400 ml-2">Pending</span>
      </div>
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-5 py-3">
        <span className="text-blue-400 font-bold text-2xl">{inProgress}</span>
        <span className="text-gray-400 ml-2">In Progress</span>
      </div>
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-5 py-3">
        <span className="text-green-400 font-bold text-2xl">{completed}</span>
        <span className="text-gray-400 ml-2">Completed</span>
      </div>
    </div>
  )
}
