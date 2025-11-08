export default function Loading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4" aria-live="polite" aria-label="Loading">
      <div className="text-center">
        <div className="relative inline-block mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-900"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-r-gray-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <p className="text-gray-600 font-medium text-lg">Loading...</p>
        <p className="text-gray-400 text-sm mt-2">Please wait</p>
      </div>
    </div>
  );
}

