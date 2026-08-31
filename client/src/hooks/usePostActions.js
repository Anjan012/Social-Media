import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { postService } from "../services/postService";

export const getLikeSnapshot = (post, authUserId, uiLiked) => {
  const likes = Array.isArray(post?.likes) ? post.likes : [];
  const likedByUser = likes.includes(authUserId);
  const isLiked = typeof uiLiked === "boolean" ? uiLiked : likedByUser;
  const likeCount =
    likes.length +
    (isLiked && !likedByUser ? 1 : 0) -
    (!isLiked && likedByUser ? 1 : 0);

  return { isLiked, likeCount };
};

export function usePostActions({ posts = [], setPosts, authUserId } = {}) {
  const [likedPosts, setLikedPosts] = useState({});

  useEffect(() => {
    if (!authUserId || !Array.isArray(posts)) return;

    const nextLikedPosts = {};

    posts.forEach((post) => {
      nextLikedPosts[post._id] = Array.isArray(post?.likes)
        ? post.likes.includes(authUserId)
        : false;
    });

    setLikedPosts((prev) => ({ ...prev, ...nextLikedPosts }));
  }, [authUserId, posts]);

  const toggleLike = useCallback(
    async (postId) => {
      if (!setPosts) return;

      const previousLiked = Boolean(likedPosts[postId]);
      const nextLiked = !previousLiked;

      setLikedPosts((prev) => ({ ...prev, [postId]: nextLiked }));
      setPosts((prev) =>
        prev.map((post) => {
          if (post._id !== postId) return post;

          const nextLikes = Array.isArray(post.likes) ? [...post.likes] : [];
          const hasUserLike = nextLikes.includes(authUserId);

          const updatedLikes = nextLiked
            ? hasUserLike
              ? nextLikes
              : [...nextLikes, authUserId]
            : nextLikes.filter((id) => id !== authUserId);

          return { ...post, likes: updatedLikes };
        }),
      );

      try {
        const response = await postService.toggleLike(postId);
        const result = response?.data || {};
        const serverLiked = Boolean(result.isLiked);

        setLikedPosts((prev) => ({ ...prev, [postId]: serverLiked }));
        setPosts((prev) =>
          prev.map((post) => {
            if (post._id !== postId) return post;

            const previousLikes = Array.isArray(post.likes) ? [...post.likes] : [];
            const normalizedLikes = serverLiked
              ? previousLikes.includes(authUserId)
                ? previousLikes
                : [...previousLikes, authUserId]
              : previousLikes.filter((id) => id !== authUserId);

            return {
              ...post,
              likes: normalizedLikes,
            };
          }),
        );
      } catch (error) {
        setLikedPosts((prev) => ({ ...prev, [postId]: previousLiked }));
        setPosts((prev) =>
          prev.map((post) => {
            if (post._id !== postId) return post;

            const nextLikes = Array.isArray(post.likes) ? [...post.likes] : [];
            const hasUserLike = nextLikes.includes(authUserId);
            const revertedLikes = previousLiked
              ? hasUserLike
                ? nextLikes
                : [...nextLikes, authUserId]
              : nextLikes.filter((id) => id !== authUserId);

            return { ...post, likes: revertedLikes };
          }),
        );

        console.error(error);
        toast.error("Couldn't update like");
      }
    },
    [authUserId, likedPosts, setPosts],
  );

  const deletePost = useCallback(
    async (postId) => {
      if (!setPosts) return false;

      try {
        const response = await postService.deletePost(postId);

        if (response.status >= 200 && response.status < 300) {
          setPosts((prev) => prev.filter((post) => post._id !== postId));
          toast.success("Post deleted successfully");
          return true;
        }

        toast.error("Failed to delete post");
        return false;
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete post");
        return false;
      }
    },
    [setPosts],
  );

  return {
    likedPosts,
    toggleLike,
    deletePost,
  };
}
