import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const TASKS_FILE = path.join(process.cwd(), '.tasks', 'tasks.json');

function readTasks() {
  if (!fs.existsSync(TASKS_FILE)) return [];
  const data = fs.readFileSync(TASKS_FILE, 'utf-8');
  return JSON.parse(data);
}

function writeTasks(tasks: any[]) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status } = await request.json();
  const tasks = readTasks();
  const taskIndex = tasks.findIndex((t: any) => t.id === id);
  
  if (taskIndex !== -1) {
    tasks[taskIndex].status = status;
    writeTasks(tasks);
    return NextResponse.json({ task: tasks[taskIndex] });
  }
  
  return NextResponse.json({ error: 'Task not found' }, { status: 404 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const tasks = readTasks();
  const filtered = tasks.filter((t: any) => t.id !== id);
  writeTasks(filtered);
  return NextResponse.json({ success: true });
}
