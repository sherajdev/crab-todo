"use client"

import { useState } from "react"

interface AddTaskFormProps {
  onAdd: (title: string) => Promise<void>
}

export function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || isLoading) return

    setIsLoading(true)
    await onAdd(title.trim())
    setTitle("")
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={!title.trim() || isLoading}
        className="bg-teal hover:bg-teal/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-medium px-6 py-3 rounded-lg transition-colors"
      >
        {isLoading ? "Adding..." : "Add Task"}
      </button>
    </form>
  )
}
