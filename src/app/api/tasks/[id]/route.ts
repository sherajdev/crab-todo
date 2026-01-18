import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

// PATCH /api/tasks/:id - Update task status or title
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { env } = getRequestContext();
    const { id } = await params;
    const { status, title } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    // Check if task exists
    const existing = await env.DB.prepare(
      "SELECT * FROM tasks WHERE id = ?"
    ).bind(id).first();

    if (!existing) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Update status
    if (status) {
      if (!['pending', 'in-progress', 'completed'].includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 }
        );
      }
      await env.DB.prepare(
        "UPDATE tasks SET status = ?, updated_at = datetime('now') WHERE id = ?"
      ).bind(status, id).run();
    }

    // Update title
    if (title && title.trim() !== '') {
      await env.DB.prepare(
        "UPDATE tasks SET title = ?, updated_at = datetime('now') WHERE id = ?"
      ).bind(title.trim(), id).run();
    }

    // Fetch updated task
    const updated = await env.DB.prepare(
      "SELECT * FROM tasks WHERE id = ?"
    ).bind(id).first();

    return NextResponse.json({ task: updated });
  } catch (error) {
    console.error('PATCH task error:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/:id - Delete task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { env } = getRequestContext();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    // Check if task exists
    const existing = await env.DB.prepare(
      "SELECT * FROM tasks WHERE id = ?"
    ).bind(id).first();

    if (!existing) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    await env.DB.prepare(
      "DELETE FROM tasks WHERE id = ?"
    ).bind(id).run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE task error:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
