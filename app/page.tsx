import { getAllTasks } from '@/lib/tasks';
import { STATUS_LABELS } from '@/types';
import type { Status, Task } from '@/types';
import TaskCard from '@/components/TaskCard';
import SearchFilter from '@/components/SearchFilter';
import Link from 'next/link';

interface PageProps {
  searchParams: {
    status?: string;
    priority?: string;
    search?: string;
  };
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const tasks = await getAllTasks({
    status: searchParams.status as Status | undefined,
    priority: searchParams.priority as any,
    search: searchParams.search,
  });

  const columns: Status[] = ['TODO', 'IN_PROGRESS', 'DONE'];

  const grouped = columns.reduce<Record<Status, Task[]>>(
    (acc, status) => {
      acc[status] = tasks.filter((t) => t.status === status);
      return acc;
    },
    { TODO: [], IN_PROGRESS: [], DONE: [] }
  );

  const columnColors: Record<Status, string> = {
    TODO: 'border-slate-500',
    IN_PROGRESS: 'border-blue-500',
    DONE: 'border-green-500',
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Task Dashboard</h1>
            <p className="text-gray-400 mt-1">{tasks.length} tasks total</p>
          </div>
          <Link
            href="/tasks/new"
            className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            + New Task
          </Link>
        </div>

        {/* Filters */}
        <SearchFilter />

        {/* Kanban Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {columns.map((status) => (
            <div
              key={status}
              className={`bg-gray-900 rounded-xl border-t-2 ${columnColors[status]} p-4`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-200">
                  {STATUS_LABELS[status]}
                </h2>
                <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-full">
                  {grouped[status].length}
                </span>
              </div>
              <div className="space-y-3">
                {grouped[status].length === 0 ? (
                  <p className="text-gray-600 text-sm text-center py-8">
                    No tasks
                  </p>
                ) : (
                  grouped[status].map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
