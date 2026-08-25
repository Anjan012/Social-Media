import { useState, useEffect, useCallback, useContext } from "react";
import { toast } from "sonner";
import { AuthContext } from "../context/AuthContext";
import { postService } from "../services/postService";
 
/**
 * Owns all feed state and business logic for the Home page:
 * - fetching posts
 * - optimistic like/unlike
 * - delete
 * - copy comment-link
 *
 * Returns posts already enriched with `isLiked` / `likeCount` / `isOwnPost`
 * so PostCard can stay purely presentational.
 */
export function useHomeFeed() {
  const { authUser } = useContext(AuthContext);
 
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
 
  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
 
      const response = await postService.getAllPosts();
      const fetchedPosts = response.data.posts;
      setPosts(fetchedPosts);
 
      const initialLikedPosts = {};
      fetchedPosts.forEach((post) => {
        if (post.likes.includes(authUser?._id)) {
          initialLikedPosts[post._id] = true;
        }
      });
      setLikedPosts(initialLikedPosts);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setError("Unable to load posts. Please try again.");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser?._id]);
 
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);
 
  const toggleLike = useCallback(async (postId) => {
    const wasLiked = !!likedPosts[postId];
 
    // Optimistic UI update
    setLikedPosts((prev) => ({ ...prev, [postId]: !wasLiked }));
 
    try {
      await postService.toggleLike(postId);
    } catch (err) {
      console.error(err);
      // Revert on failure
      setLikedPosts((prev) => ({ ...prev, [postId]: wasLiked }));
      toast.error("Couldn't update like");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [likedPosts]);
 
  const deletePost = useCallback(async (postId) => {
    try {
      const response = await postService.deletePost(postId);
      if (response.status === 200) {
        setPosts((prev) => prev.filter((post) => post._id !== postId));
        toast("Post deleted successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete post");
    }
  }, []);
 
  const copyPostLink = useCallback(async (postId) => {
    const url = `${window.location.origin}/post/${postId}/comment`;
 
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        toast.success("Copied to clipboard");
        return;
      }
 
      // Fallback for browsers without the async Clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast.success("Copied to clipboard");
    } catch (err) {
      console.error("Copy failed:", err);
      toast.error("Couldn't copy link");
    }
  }, []);
 
  // Derive display-ready posts so PostCard never computes like state itself.
  const feed = posts.map((post) => {
    const isLiked = !!likedPosts[post._id];
    const alreadyCountedInLikes = post.likes.includes(authUser?._id);
    const likeCount =
      post.likes.length +
      (isLiked && !alreadyCountedInLikes ? 1 : 0) -
      (!isLiked && alreadyCountedInLikes ? 1 : 0);
 
    return {
      ...post,
      isLiked,
      likeCount,
      isOwnPost: post.createdBy?._id === authUser?._id,
    };
  });
 
  return {
    posts: feed,
    isLoading,
    error,
    toggleLike,
    deletePost,
    copyPostLink,
    refetch: fetchPosts,
  };
}