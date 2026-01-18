import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

// GET /api/tasks - List all tasks
export async function GET() {
  try {
    const { env } = getRequestContext();
    const { results } = await env.DB.prepare(
      "SELECT * FROM tasks ORDER BY created_at DESC"
    ).all();

    return NextResponse.json({
      tasks: results,
      count: results.length
    });
  } catch (error) {
    console.error('GET tasks error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create new task
export async function POST(request: NextRequest) {
  try {
    const { env } = getRequestContext();
    const { title, status = 'pending' } = await request.json();

    // Validation
    if (!title || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!['pending', 'in-progress', 'completed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: pending, in-progress, or completed' },
        { status: 400 }
      );
    }

    const id = Date.now().toString();

    await env.DB.prepare(
      "INSERT INTO tasks (id, title, status, created_at, updated_at) VALUES (?, ?, ?, datetime('now'), datetime('now'))"
    ).bind(id, title.trim(), status).run();

    return NextResponse.json({
      task: {
        id,
        title: title.trim(),
        status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }, { status: 201 });
  } catch (error) {
    console.error('POST task error:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
