export const PostSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden my-4 animate-pulse">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          
          {/* Avatar */}
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800" />

          <div className="space-y-2">
            {/* Username */}
            <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-800" />

            {/* Date */}
            <div className="h-3 w-40 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>

        {/* Menu */}
        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-800" />
      </div>

      {/* Content */}
      <div className="px-4 pb-4 space-y-2">
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-4/5 rounded bg-gray-200 dark:bg-gray-800" />
      </div>

      {/* Image */}
      <div className="w-full aspect-4/3 bg-gray-200 dark:bg-gray-800" />

      {/* Actions */}
      <div className="flex items-center gap-8 px-4 py-4 border-t border-gray-200 dark:border-gray-800">
        <div className="h-5 w-12 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-5 w-12 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-5 w-12 rounded bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>
  );
};
