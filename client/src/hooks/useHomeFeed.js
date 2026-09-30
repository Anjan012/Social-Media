import { useState, useEffect, useCallback, useContext, useRef } from "react";
import { toast } from "sonner";
import { AuthContext } from "../context/AuthContext";
import { postService } from "../services/postService";
import { getLikeSnapshot, usePostActions } from "./usePostActions";

export function useHomeFeed() {
  const { authUser } = useContext(AuthContext);
  const requestInFlightRef = useRef(false);

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { toggleLike, deletePost } = usePostActions({
    posts,
    setPosts,
    authUserId: authUser?._id,
  });

  const fetchPosts = useCallback(async (nextPage = 1) => {
    if (requestInFlightRef.current) return;

    requestInFlightRef.current = true;
    setError(null);
    setIsLoading(nextPage === 1);
    setIsLoadingMore(nextPage > 1);

    try {
      const response = await postService.getAllPosts({
        page: nextPage,
        limit: 20,
      });

      const fetchedPosts = response.data.posts || [];
      const isInitialLoad = nextPage === 1;

      setPosts((prevPosts) => (isInitialLoad ? fetchedPosts : [...prevPosts, ...fetchedPosts]));
      setPage(nextPage);
      setHasMore(Boolean(response.data.hasMore));
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setError("Unable to load posts. Please try again.");
    } finally {
      requestInFlightRef.current = false;
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  const loadMore = useCallback(() => {
    if (requestInFlightRef.current || isLoading || isLoadingMore || !hasMore) return;
    fetchPosts(page + 1);
  }, [fetchPosts, hasMore, isLoading, isLoadingMore, page]);

  const copyPostLink = useCallback(async (postId) => {
    const url = `${window.location.origin}/post/${postId}/comment`;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        toast.success("Copied to clipboard");
        return;
      }

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

  const addCreatedPost = useCallback((newPost) => {
    if (!newPost || !newPost._id) return;

    setPosts((prevPosts) => [
      {
        ...newPost,
        createdBy: newPost.createdBy || { _id: authUser?._id, username: authUser?.username },
        likes: Array.isArray(newPost.likes) ? newPost.likes : [],
        comments: Array.isArray(newPost.comments) ? newPost.comments : [],
      },
      ...prevPosts,
    ]);
  }, [authUser?._id, authUser?.username]);

  const feed = posts.map((post) => {
    const snapshot = getLikeSnapshot(post, authUser?._id, undefined);
    const isOwnPost = post.createdBy?._id === authUser?._id;

    return {
      ...post,
      isLiked: snapshot.isLiked,
      likeCount: snapshot.likeCount,
      isOwnPost,
    };
  });

  return {
    posts: feed,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    toggleLike,
    deletePost,
    copyPostLink,
    loadMore,
    refetch: fetchPosts,
    addCreatedPost,
  };
}