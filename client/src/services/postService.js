import axios from "axios";
 
const API_URL = import.meta.env.VITE_API_URL;
const POSTS_URL = `${API_URL}/api/v1/posts`;
 
/**
 * All post-related network calls live here so components/hooks never
 * touch axios directly. Endpoints are unchanged from the original Home.jsx.
 */
export const postService = {
  getAllPosts: () => axios.get(POSTS_URL, { withCredentials: true }),
 
  deletePost: (postId) =>
    axios.delete(`${POSTS_URL}/${postId}`, { withCredentials: true }),
 
  toggleLike: (postId) =>
    axios.post(`${POSTS_URL}/${postId}/like`, {}, { withCredentials: true }),
};