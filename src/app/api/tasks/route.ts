import { NextResponse } from "next/server"
import { getAllTasks, createTask } from "@/lib/tasks"

export async function GET() {
  const tasks = getAllTasks()
  return NextResponse.json({ tasks })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title } = body

    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      )
    }

    const task = createTask(title.trim())
    return NextResponse.json(task, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }
}
