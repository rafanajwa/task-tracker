import { getTaskById } from '@/lib/tasks';
import { notFound, redirect } from 'next/navigation';
import { STATUS_LABELS, PRIORITY_LABELS } from '@/types';
import type { Priority, Status } from '@/types';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';

const priorityColors: Record<Priority, string> = {
  LOW: 'bg-slate-700 text-slate-300',
  MEDIUM: 'bg-blue-900 text-blue-300',
  HIGH: 'bg-orange-900 text-orange-300',
  URGENT: 'bg-red-900 text-red-300',
};

const statusColors: Record<Status, string> = {
  TODO: 'bg-slate-700 text-slate-300',
  IN_PROGRESS: 'bg-blue-900 text-blue-300',
  DONE: 'bg-green-900 text-green-300',
};

export default async function TaskDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Prevent "new" from being treated as a UUID
  if (params.id === 'new') redirect('/tasks/new');

  const task = await getTaskById(params.id);
  if (!task) notFound();

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                statusColors[task.status]
              }`}
            >
              {STATUS_LABELS[task.status]}
            </span>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                priorityColors[task.priority]
              }`}
            >
              {PRIORITY_LABELS[task.priority]} Priority
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-3">{task.title}</h1>

          {task.description ? (
            <p className="text-gray-400 leading-relaxed mb-6">
              {task.description}
            </p>
          ) : (
            <p className="text-gray-600 italic mb-6">
              No description provided.
            </p>
          )}

          <div className="border-t border-gray-800 pt-4 mb-6 grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <span className="block text-gray-600 text-xs mb-1">Created</span>
              {new Date(task.created_at).toLocaleString()}
            </div>
            <div>
              <span className="block text-gray-600 text-xs mb-1">
                Last updated
              </span>
              {new Date(task.updated_at).toLocaleString()}
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/tasks/${task.id}/edit`}
              className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Edit Task
            </Link>
            <DeleteButton taskId={task.id} />
          </div>
        </div>
      </div>
    </main>
  );
}
