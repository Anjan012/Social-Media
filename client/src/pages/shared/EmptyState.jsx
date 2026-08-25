export const EmptyState = ({ message = "Nothing here yet." }) => (
  <div className="my-4 rounded-xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900">
    <p className="text-gray-600 dark:text-gray-400">{message}</p>
  </div>
);