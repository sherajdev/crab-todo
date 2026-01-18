-- Main tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('pending', 'in-progress', 'completed')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_created ON tasks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_id ON tasks(id);

-- Triggers for automatic updated_at
CREATE TRIGGER IF NOT EXISTS update_tasks_timestamp
AFTER UPDATE ON tasks
FOR EACH ROW
BEGIN
    UPDATE tasks SET updated_at = datetime('now') WHERE id = OLD.id;
END;
