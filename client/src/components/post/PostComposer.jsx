import { useContext, useState } from "react";
import { ImageIcon, StickyNote, BarChart3, Smile, ChevronDown } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";

/**
 * Presentational composer. Wire `onSubmit` to your create-post mutation —
 * left decoupled here since the create-post endpoint wasn't in scope.
 */
export const PostComposer = ({ onSubmit }) => {
  const { authUser } = useContext(AuthContext);
  const [content, setContent] = useState("");

  const handlePost = () => {
    if (!content.trim()) return;
    onSubmit?.(content.trim());
    setContent("");
  };

  return (
    <div className="my-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 sm:my-4 sm:p-4">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={authUser?.profilePicture} alt={authUser?.username} />
          <AvatarFallback className="bg-red-500 text-white">
            {authUser?.username?.slice(0, 2)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={2}
          className="w-full resize-none border-none bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white sm:text-base"
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 sm:text-sm"
          >
            <ImageIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Photo/Video</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 sm:text-sm"
          >
            <StickyNote className="h-4 w-4" />
            <span className="hidden sm:inline">GIF</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 sm:text-sm"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Poll</span>
          </button>
          <button
            type="button"
            className="rounded-md p-1.5 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Add emoji"
          >
            <Smile className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handlePost}
            disabled={!content.trim()}
            className="bg-red-500 hover:bg-red-600 text-white"
            size="sm"
          >
            Post
          </Button>
          <button
            type="button"
            className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1.5 text-xs text-gray-600 dark:border-gray-700 dark:text-gray-400"
          >
            Public
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}; 