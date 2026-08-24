export const ErrorState = ({ message = "Something went wrong." }) => (
  <div className="my-4 rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-950/20">
    <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
  </div>
);
 