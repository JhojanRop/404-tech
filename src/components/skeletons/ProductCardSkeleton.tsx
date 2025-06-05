export default function ProductCardSkeleton() {
  return (
    <div className="block animate-pulse">
      <div className="border border-gray-300 rounded-lg bg-white h-full">
        <div className="relative aspect-square w-full px-6 py-3 overflow-hidden rounded-lg bg-white flex items-center justify-center">
          <div className="w-full h-full bg-gray-200 rounded-lg" />
        </div>
        <div className="px-6 pb-6 flex flex-col gap-2">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="flex gap-3">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-100 rounded w-1/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}