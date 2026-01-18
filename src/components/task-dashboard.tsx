"use client"

import { useState, useEffect, useCallback } from "react"
import useSWR from "swr"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddTaskForm } from "@/components/add-task-form"
import { TaskList } from "@/components/task-list"
import { StatsCards } from "@/components/stats-cards"
import type { Task } from "@/lib/tasks"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type FilterType = "all" | "pending" | "in-progress" | "completed"

export function TaskDashboard() {
  const { data, mutate, isValidating } = useSWR<{ tasks: Task[] }>(
    "/api/tasks",
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  )

  const [filter, setFilter] = useState<FilterType>("all")
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const tasks = data?.tasks || []

  useEffect(() => {
    if (data) {
      setLastRefresh(new Date())
    }
  }, [data])

  const handleAddTask = useCallback(
    async (title: string) => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      })
      if (res.ok) {
        mutate()
      }
    },
    [mutate]
  )

  const handleUpdateTask = useCallback(
    async (id: string, updates: { status?: string; title?: string }) => {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (res.ok) {
        mutate()
      }
    },
    [mutate]
  )

  const handleDeleteTask = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        mutate()
      }
    },
    [mutate]
  )

  const filters: { value: FilterType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ]

  const formatLastRefresh = () => {
    const now = new Date()
    const diffSecs = Math.floor((now.getTime() - lastRefresh.getTime()) / 1000)
    if (diffSecs < 10) return "Just now"
    if (diffSecs < 60) return `${diffSecs}s ago`
    const diffMins = Math.floor(diffSecs / 60)
    return `${diffMins}m ago`
  }

  const getFilterCount = (filterValue: FilterType) => {
    if (filterValue === "all") return tasks.length
    return tasks.filter((t) => t.status === filterValue).length
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Header */}
      <header className="text-center py-10 border-b border-white/10">
        <div className="text-6xl mb-4 animate-float-crab">🦀</div>
        <h1 className="text-3xl font-bold text-gradient mb-2">
          C.R.A.B Live Tasks Dashboard
        </h1>
        <p className="text-teal text-sm uppercase tracking-widest">
          Always optimizing. Forever loyal. 🦀
        </p>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Stats */}
        <StatsCards tasks={tasks} />

        {/* Last Updated */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">
            Last updated: {formatLastRefresh()} (UTC+8)
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => mutate()}
            disabled={isValidating}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isValidating ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Add Task Form */}
        <div className="mb-6">
          <AddTaskForm onAdd={handleAddTask} />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f.value
                  ? "bg-white/20 text-white border border-white/30"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
                }`}
            >
              {f.label}
              <span className="ml-2 opacity-70">({getFilterCount(f.value)})</span>
            </button>
          ))}
        </div>

        {/* Task List */}
        <TaskList
          tasks={tasks}
          filter={filter}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
        />
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-8">
        <div className="max-w-4xl mx-auto px-6 py-4 text-gray-500 text-sm text-center">
          Powered by C.R.A.B • Auto-refreshes every 30s
        </div>
      </footer>
    </div>
  )
}
