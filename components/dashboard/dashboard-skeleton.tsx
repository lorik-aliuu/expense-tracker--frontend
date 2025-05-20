export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              </div>
              <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded mt-4"></div>
              <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
            </div>
          ))}
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-60 bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
        </div>
        <div className="p-6">
          <div className="h-[300px] bg-gray-100 dark:bg-gray-800 rounded"></div>
        </div>
      </div>
    </div>
  )
}
