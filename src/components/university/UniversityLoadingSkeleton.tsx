
const UniversityLoadingSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-60 skeleton rounded-lg"></div>
        <div className="h-10 w-40 skeleton rounded-lg"></div>
      </div>
      
      {/* Search and filter skeletons */}
      <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="h-10 w-full skeleton rounded-lg"></div>
          <div className="h-10 w-full sm:w-48 skeleton rounded-lg"></div>
          <div className="h-10 w-full sm:w-32 skeleton rounded-lg"></div>
        </div>
      </div>
      
      {/* Results count skeleton */}
      <div className="mb-4 h-5 w-40 skeleton rounded-lg"></div>
      
      {/* University card skeletons */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="h-96 w-full skeleton rounded-xl"></div>
        ))}
      </div>
    </div>
  );
};

export default UniversityLoadingSkeleton;
