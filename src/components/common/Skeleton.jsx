function ShimmerBlock({ className }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent animate-shimmer" />
    </div>
  )
}

export function ProductSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <ShimmerBlock className="aspect-[3/4] bg-gray-200 dark:bg-gray-700" />
          <div className="p-3 md:p-4 space-y-2">
            <ShimmerBlock className="h-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3" />
            <ShimmerBlock className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4" />
            <ShimmerBlock className="h-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2" />
            <div className="flex gap-2 pt-1">
              <ShimmerBlock className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-16" />
              <ShimmerBlock className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <ShimmerBlock className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        <div className="space-y-4">
          <ShimmerBlock className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4" />
          <ShimmerBlock className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/4" />
          <ShimmerBlock className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3" />
          <ShimmerBlock className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="flex gap-2">
            {[1, 2, 3].map(i => <ShimmerBlock key={i} className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />)}
          </div>
          <ShimmerBlock className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function BannerSkeleton() {
  return <ShimmerBlock className="h-[300px] md:h-[500px] bg-gray-200 dark:bg-gray-700 rounded-2xl mx-4 md:mx-8" />
}

export function ListSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <ShimmerBlock className="aspect-[3/4] bg-gray-200 dark:bg-gray-700" />
          <div className="p-4 space-y-2">
            <ShimmerBlock className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <ShimmerBlock className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <ShimmerBlock className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}


