import { useContext, useEffect, useRef, useState } from "react";
import {
  ImageIcon,
  StickyNote,
  BarChart3,
  Smile,
  ChevronDown,
  X,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

import { AuthContext } from "../../context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";

const API_URL = import.meta.env.VITE_API_URL;

export const PostComposer = ({ onSubmit }) => {
  const { authUser } = useContext(AuthContext);

  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isPosting, setIsPosting] = useState(false);

  const fileInputRef = useRef(null);

  /**
   * Clean up object URLs when the component unmounts
   * or when the selected media changes.
   */
  useEffect(() => {
    return () => {
      if (mediaPreview) {
        URL.revokeObjectURL(mediaPreview);
      }
    };
  }, [mediaPreview]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Basic client-side validation
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (file.size > maxSize) {
      toast.error("Media file must be smaller than 10MB");

      // Reset input so the same file can be selected again
      event.target.value = "";
      return;
    }

    // Revoke previous preview URL
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }

    setMedia(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const handleRemoveMedia = () => {
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }

    setMedia(null);
    setMediaPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetComposer = () => {
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }

    setContent("");
    setMedia(null);
    setMediaPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePost = async (event) => {
    event.preventDefault();

    const trimmedContent = content.trim();

    // Allow either content or media
    if (!trimmedContent && !media) {
      toast.error("Post content or media is required");
      return;
    }

    try {
      setIsPosting(true);

      const formData = new FormData();

      if (trimmedContent) {
        formData.append("content", trimmedContent);
      }

      if (media) {
        // Must match multer field name on the backend
        formData.append("media", media);
      }

      const response = await axios.post(
        `${API_URL}/api/v1/posts`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        toast.success("Post created successfully");

        // Notify parent if it wants to refresh/update the feed
        onSubmit?.(response.data);

        resetComposer();
      }
    } catch (error) {
      console.error("Failed to create post:", error);

      const message =
        error?.response?.data?.message ||
        "Failed to create post. Please try again.";

      toast.error(message);
    } finally {
      setIsPosting(false);
    }
  };

  const username = authUser?.username || "User";
  const profilePicture = authUser?.profilePicture;

  const isVideo = media?.type?.startsWith("video/");

  return (
    <div className="my-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 sm:my-4 sm:p-4">
      <form onSubmit={handlePost}>
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage
              src={profilePicture}
              alt={username}
            />

            <AvatarFallback className="bg-red-500 text-white">
              {username.slice(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="What's on your mind?"
              rows={2}
              disabled={isPosting}
              className="w-full resize-none border-none bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:text-white sm:text-base"
            />

            {/* Media preview */}
            {media && mediaPreview && (
              <div className="relative mt-3 w-full max-w-sm overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                {isVideo ? (
                  <video
                    src={mediaPreview}
                    controls
                    className="max-h-64 w-full object-cover"
                  />
                ) : (
                  <img
                    src={mediaPreview}
                    alt="Selected media preview"
                    className="max-h-64 w-full object-cover"
                  />
                )}

                <button
                  type="button"
                  onClick={handleRemoveMedia}
                  disabled={isPosting}
                  aria-label="Remove media"
                  className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Photo / Video */}
            <label
              htmlFor="post-media"
              className={`flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 sm:text-sm ${
                isPosting ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <ImageIcon className="h-4 w-4" />

              <span className="hidden sm:inline">
                Photo/Video
              </span>

              <input
                ref={fileInputRef}
                id="post-media"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                disabled={isPosting}
                className="hidden"
              />
            </label>

            {/* GIF */}
            <button
              type="button"
              disabled
              className="flex cursor-not-allowed items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-gray-400 opacity-60 sm:text-sm"
            >
              <StickyNote className="h-4 w-4" />
              <span className="hidden sm:inline">GIF</span>
            </button>

            {/* Poll */}
            <button
              type="button"
              disabled
              className="flex cursor-not-allowed items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-gray-400 opacity-60 sm:text-sm"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Poll</span>
            </button>

            {/* Emoji */}
            <button
              type="button"
              disabled
              aria-label="Add emoji"
              className="rounded-md p-1.5 text-gray-400 opacity-60"
            >
              <Smile className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="submit"
              disabled={
                isPosting ||
                (!content.trim() && !media)
              }
              className="bg-red-500 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              size="sm"
            >
              {isPosting ? "Posting..." : "Post"}
            </Button>

            <button
              type="button"
              disabled
              className="flex cursor-not-allowed items-center gap-1 rounded-md border border-gray-200 px-2 py-1.5 text-xs text-gray-400 opacity-60 dark:border-gray-700"
            >
              Public
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
