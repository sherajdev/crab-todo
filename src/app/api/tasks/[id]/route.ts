import { NextResponse } from "next/server"
import { updateTask, deleteTask, getTaskById } from "@/lib/tasks"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const task = getTaskById(id)

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 })
  }

  return NextResponse.json(task)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, title } = body

    const validStatuses = ["pending", "in-progress", "completed"]
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be: pending, in-progress, or completed" },
        { status: 400 }
      )
    }

    const updates: { status?: "pending" | "in-progress" | "completed"; title?: string } = {}
    if (status) updates.status = status as "pending" | "in-progress" | "completed"
    if (title) updates.title = title.trim()

    const task = updateTask(id, updates)

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const deleted = deleteTask(id)

  if (!deleted) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
