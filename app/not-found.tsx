import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold mb-2">Task Not Found</h2>
        <p className="text-gray-400 mb-6">
          This task doesn&apos;t exist or has been deleted.
        </p>
        <Link
          href="/"
          className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
