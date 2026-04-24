const ShimmerCard = () => {
  return (
    <div className="w-full h-72 p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded-xl mb-4"></div>
      {/* Title Skeleton */}
      <div className="w-3/4 h-5 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
      {/* Meta details Skeleton */}
      <div className="w-1/2 h-4 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
      <div className="w-full border-t border-gray-300 dark:border-gray-700 my-2"></div>
      {/* Footer Skeleton */}
      <div className="w-1/3 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
    </div>
  );
};

const Shimmer = () => {
  // 8 dummy cards generate kar rahe hain UI fill karne ke liye
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 max-w-7xl mx-auto">
      {Array(8).fill("").map((_, index) => (
        <ShimmerCard key={index} />
      ))}
    </div>
  );
};

export default Shimmer;