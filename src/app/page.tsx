'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  created_at: string;
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  'in-progress': { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  completed: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data.tasks || []);
      updateLastUpdated();
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLastUpdated = () => {
    const now = new Date();
    const formatted = now.toLocaleString('en-CA', {
      timeZone: 'Asia/Singapore',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    setLastUpdated(formatted.replace(',', ''));
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 30000);
    return () => clearInterval(interval);
  }, []);

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Header */}
      <header className="text-center py-10 border-b border-white/10">
        <div className="text-6xl mb-4 animate-float-crab">🦀</div>
        <h1 className="text-3xl font-bold text-gradient mb-2">C.R.A.B Live Tasks Dashboard</h1>
        <p className="text-[var(--teal)] text-sm uppercase tracking-widest">
          Always optimizing. Forever loyal. 🦀
        </p>
      </header>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex gap-4 flex-wrap">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-5 py-3">
            <span className="text-yellow-400 font-bold text-2xl">{pendingCount}</span>
            <span className="text-gray-400 ml-2">Pending</span>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-5 py-3">
            <span className="text-blue-400 font-bold text-2xl">{inProgressCount}</span>
            <span className="text-gray-400 ml-2">In Progress</span>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-5 py-3">
            <span className="text-green-400 font-bold text-2xl">{completedCount}</span>
            <span className="text-gray-400 ml-2">Completed</span>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="max-w-4xl mx-auto px-6">
        {lastUpdated && (
          <p className="text-gray-500 text-sm mb-4">
            Last updated: {lastUpdated} (UTC+8)
          </p>
        )}
      </div>

      {/* Tasks List */}
      <main className="max-w-4xl mx-auto px-6 pb-12">
        {loading ? (
          <p className="text-gray-400 text-center py-12">Crunching the data...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-400 text-center py-12">
            No tasks? Either I&apos;m on top of things, or you&apos;re not giving me enough to do. 😏
          </p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between group"
              >
                <div className="flex-1">
                  <p className="text-lg">{task.title}</p>
                  <p className="text-gray-500 text-sm">{task.created_at}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm border ${statusColors[task.status].bg} ${statusColors[task.status].text} ${statusColors[task.status].border}`}>
                    {task.status}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {task.status !== 'in-progress' && (
                      <button
                        onClick={() => updateStatus(task.id, 'in-progress')}
                        className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 px-3 py-1 rounded text-sm transition-colors"
                      >
                        ▶️
                      </button>
                    )}
                    {task.status !== 'completed' && (
                      <button
                        onClick={() => updateStatus(task.id, 'completed')}
                        className="bg-green-500/20 hover:bg-green-500/40 text-green-400 px-3 py-1 rounded text-sm transition-colors"
                      >
                        ✅
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="bg-red-500/20 hover:bg-red-500/40 text-red-400 px-3 py-1 rounded text-sm transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-8">
        <div className="max-w-4xl mx-auto px-6 py-4 text-gray-500 text-sm text-center">
          Powered by C.R.A.B • Auto-refreshes every 30s
        </div>
      </footer>
    </div>
  );
}
