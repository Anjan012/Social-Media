import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";

// TODO: replace with a useSuggestedUsers hook + userService call once the
// suggestions endpoint exists. Static placeholder to match the design.
const DEFAULT_SUGGESTIONS = [
  { id: "1", username: "mrkitty_012", displayName: "Mr.Kitty_012" },
  { id: "2", username: "mrkitty_013", displayName: "Mr.Kitty_012" },
  { id: "3", username: "mrkitty_014", displayName: "Mr.Kitty_012" },
];

export const WhoToFollow = ({ suggestions = DEFAULT_SUGGESTIONS, onFollow }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
    <h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
      Who to follow
    </h2>
    <ul className="space-y-4">
      {suggestions.map((user) => (
        <li key={user.id} className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src={user.profilePicture} alt={user.username} />
              <AvatarFallback className="bg-red-500 text-xs text-white">
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                {user.displayName}
              </p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                @{user.username}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => onFollow?.(user.id)}
            className="shrink-0 bg-red-500 text-white hover:bg-red-600"
          >
            Add
          </Button>
        </li>
      ))}
    </ul>
  </div>
);