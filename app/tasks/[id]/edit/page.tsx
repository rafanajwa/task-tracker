import { getTaskById } from '@/lib/tasks';
import { notFound } from 'next/navigation';
import TaskForm from '@/components/TaskForm';
import Link from 'next/link';

export default async function EditTaskPage({
  params,
}: {
  params: { id: string };
}) {
  const task = await getTaskById(params.id);
  if (!task) notFound();

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href={`/tasks/${task.id}`}
            className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
          >
            ← Back to Task
          </Link>
          <h1 className="text-2xl font-bold mt-3">Edit Task</h1>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <TaskForm task={task} />
        </div>
      </div>
    </main>
  );
}
