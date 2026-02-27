import TaskForm from '@/components/TaskForm';
import Link from 'next/link';

export default function NewTaskPage() {
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
          <h1 className="text-2xl font-bold mt-3">Create New Task</h1>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <TaskForm />
        </div>
      </div>
    </main>
  );
}
