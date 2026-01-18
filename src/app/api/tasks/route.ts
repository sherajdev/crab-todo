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

export async function GET() {
  const tasks = readTasks();
  return NextResponse.json({ tasks });
}

export async function POST(request: NextRequest) {
  const { title } = await request.json();
  const tasks = readTasks();
  const newTask = {
    id: Date.now().toString(),
    title,
    status: 'pending',
    created_at: new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' })
  };
  tasks.push(newTask);
  writeTasks(tasks);
  return NextResponse.json({ task: newTask });
}
