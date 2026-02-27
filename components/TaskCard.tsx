import Link from 'next/link';
import type { Task, Priority } from '@/types';
import { PRIORITY_LABELS } from '@/types';

const priorityColors: Record<Priority, string> = {
  LOW: 'bg-slate-700 text-slate-300',
  MEDIUM: 'bg-blue-900 text-blue-300',
  HIGH: 'bg-orange-900 text-orange-300',
  URGENT: 'bg-red-900 text-red-300',
};

export default function TaskCard({ task }: { task: Task }) {
  return (
    <Link href={`/tasks/${task.id}`}>
      <div className="bg-gray-800 hover:bg-gray-750 rounded-lg p-4 cursor-pointer transition-colors border border-transparent hover:border-gray-600">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-medium text-gray-100 line-clamp-2">
            {task.title}
          </h3>
          <span
            className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
              priorityColors[task.priority]
            }`}
          >
            {PRIORITY_LABELS[task.priority]}
          </span>
        </div>
        {task.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">
            {task.description}
          </p>
        )}
        <p className="text-xs text-gray-600">
          {new Date(task.created_at).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
}
