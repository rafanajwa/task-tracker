export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-8 w-48 bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-800 rounded animate-pulse mt-2" />
          </div>
          <div className="h-10 w-28 bg-gray-800 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bg-gray-900 rounded-xl border-t-2 border-gray-700 p-4"
            >
              <div className="h-5 w-24 bg-gray-800 rounded animate-pulse mb-4" />
              {[0, 1, 2].map((j) => (
                <div
                  key={j}
                  className="bg-gray-800 rounded-lg p-4 mb-3 animate-pulse"
                >
                  <div className="h-4 w-3/4 bg-gray-700 rounded mb-2" />
                  <div className="h-3 w-1/2 bg-gray-700 rounded" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
