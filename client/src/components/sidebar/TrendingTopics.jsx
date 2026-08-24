// TODO: replace with real data via a useTrendingTopics hook + service call
// once a /api/v1/trending endpoint exists. Kept static for now so the
// right sidebar layout matches the design.
const DEFAULT_TOPICS = [
  "#NewFeatures",
  "#MyAppUpdate",
  "#WebDesign",
  "#WebFeatures",
];

export const TrendingTopics = ({ topics = DEFAULT_TOPICS }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
    <h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
      Trending Topics
    </h2>
    <ul className="space-y-3">
      {topics.map((topic) => (
        <li key={topic}>
          <a
            href={`/search?q=${encodeURIComponent(topic)}`}
            className="text-sm font-medium text-gray-700 hover:text-red-500 dark:text-gray-300"
          >
            {topic}
          </a>
        </li>
      ))}
    </ul>
    <button
      type="button"
      className="mt-3 text-sm font-medium text-gray-500 hover:text-red-500 dark:text-gray-400"
    >
      Show more
    </button>
  </div>
);