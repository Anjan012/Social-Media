import { Navbar } from "../components/ui/shared/Navbar";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "sonner";
import { PostBox } from "./shared/Postbox";
import { PostSkeleton } from "../components/post/skeleton/PostSkeleton";
import { PostCard } from "../components/post/PostCard";

const API_URL = import.meta.env.VITE_API_URL;

export const Home = () => {
  const { authUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isOwnPost = true;

  // Store which posts are liked by current user (local UI state)
  const [likedPosts, setLikedPosts] = useState({});

  useEffect(() => {
    const POST_URL = `${API_URL}/api/v1/posts`;

    const fetchAllPost = async () => {
      try {

        setIsLoading(true);
        const response = await axios.get(POST_URL, { withCredentials: true });
        const fetchedPosts = response.data.posts;
        setPosts(fetchedPosts);

        const initialLikedPosts = {};
        fetchedPosts.forEach(post => {
          if (post.likes.includes(authUser._id)) {
            initialLikedPosts[post._id] = true;
          }
        });
        setLikedPosts(initialLikedPosts);

      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError("Unable to load posts. Please try again.");
      }
      finally {
        setIsLoading(false);
      }
    };
    fetchAllPost()
  }, []);

  const handleDeletePost = async (postId) => {
    try {
      const DELETE_URL = `${API_URL}/api/v1/posts/${postId}`;
      const response = await axios.delete(
        DELETE_URL,
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast(`Post deleted successfully`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete post");
    }
  };

  const toggleLike = async (postId) => {
    const wasLiked = !!likedPosts[postId];

    // Optimistic UI update
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !wasLiked
    }));

    try {
      const LIKE_URL = `${API_URL}/api/v1/posts/${postId}/like`;
      await axios.post(LIKE_URL, {}, { withCredentials: true });
    } catch (error) {
      console.log(error);
      // Revert on failure
      setLikedPosts(prev => ({
        ...prev,
        [postId]: wasLiked
      }));
      toast.error("Couldn't update like");
    }
  };

  const handleCopyLink = async (postId) => {
    const url = `${window.location.origin}/post/${postId}/comment`;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        toast.success("Copied to clipboard");
      } else {
        // fallback for unsupported browsers
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);

        console.log("Copied with fallback:", url);
      }
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };


  return (
    <>
      <Navbar />
      <div className="w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <PostBox />

          {
            isLoading ? (
              <>
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
              </>
            ) : error ? (
              <div className="my-6 rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-950/20">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            ) : posts.length === 0 ? (
              <div className="my-6 rounded-xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900">
                <p className="text-gray-600 dark:text-gray-400">
                  No posts yet.
                </p>
              </div>
            ) : (
              posts.map((post) => {
                const isLiked = !!likedPosts[post._id]; // true if user just liked it
                const likeCount = post.likes.length + (isLiked && !post.likes.includes(authUser._id) ? 1 : 0)
                  - (!isLiked && post.likes.includes(authUser._id) ? 1 : 0);
                return (
                  <PostCard
                    key={post._id}
                    post={post}
                    onCopyLink={handleCopyLink}
                    onDelete={handleDeletePost}
                    onLike={toggleLike}
                    isLiked={isLiked}
                    likeCount={likeCount}
                    isOwnPost={isOwnPost}
                  />
                  // <div
                  //   className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden my-4"
                  //   key={post._id}
                  // >
                  //   {/* Post Header */}
                  //   <div className="flex items-center justify-between px-4 pt-4 pb-2">
                  //     <div className="flex items-center gap-3">
                  //       <Avatar className="h-10 w-10">
                  //         <AvatarImage src={post.createdBy.profilePicture || "default_profile.jpg"} alt="User" />
                  //         <AvatarFallback className="bg-red-500 text-white">AH</AvatarFallback>
                  //       </Avatar>
                  //       <div>
                  //         <Link to={`/profile/${post.createdBy._id}`}>
                  //           <p className="font-semibold text-gray-900 dark:text-white">
                  //             {post.createdBy.username}
                  //           </p>
                  //         </Link>
                  //         <p className="text-xs text-gray-500 dark:text-gray-400">
                  //           @{post.createdBy.fullname} • {formatDate(post.createdAt)}
                  //         </p>
                  //       </div>
                  //     </div>

                  //     <Popover>
                  //       <PopoverTrigger asChild>
                  //         <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  //           <EllipsisVertical className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  //         </button>
                  //       </PopoverTrigger>

                  //       <PopoverContent className="w-72 p-0" align="end">
                  //         <Command className="rounded-lg border shadow-md">
                  //           <CommandList>
                  //             {isOwnPost && (
                  //               <CommandGroup>
                  //                 <CommandItem className="cursor-pointer flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent">
                  //                   <Edit className="h-4 w-4" />
                  //                   <span>Edit post</span>
                  //                 </CommandItem>
                  //                 <CommandItem
                  //                   onSelect={() => handleDeletePost(post._id)}
                  //                   className="cursor-pointer flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  //                 >
                  //                   <Trash2 className="h-4 w-4" />
                  //                   <span>Delete</span>
                  //                 </CommandItem>
                  //               </CommandGroup>
                  //             )}

                  //             <CommandGroup>
                  //               <CommandItem className="cursor-pointer flex items-center gap-3 px-4 py-3 text-sm">
                  //                 <Bookmark className="h-4 w-4" />
                  //                 <span>Save post</span>
                  //               </CommandItem>
                  //               <CommandItem className="cursor-pointer flex items-center gap-3 px-4 py-3 text-sm">
                  //                 <Copy className="h-4 w-4" />
                  //                 <span>Copy link</span>
                  //               </CommandItem>
                  //               <CommandItem className="cursor-pointer flex items-center gap-3 px-4 py-3 text-sm">
                  //                 <Share2 className="h-4 w-4" />
                  //                 <span>Share to...</span>
                  //               </CommandItem>
                  //             </CommandGroup>

                  //             <Separator />

                  //             <CommandGroup>
                  //               <CommandItem className="cursor-pointer flex items-center gap-3 px-4 py-3 text-sm">
                  //                 <Flag className="h-4 w-4" />
                  //                 <span>Report post</span>
                  //               </CommandItem>
                  //               <CommandItem className="cursor-pointer flex items-center gap-3 px-4 py-3 text-sm">
                  //                 <VolumeX className="h-4 w-4" />
                  //                 <span>Mute</span>
                  //               </CommandItem>
                  //             </CommandGroup>
                  //           </CommandList>
                  //         </Command>
                  //       </PopoverContent>
                  //     </Popover>
                  //   </div>

                  //   {/* Post Content */}
                  //   <div className="px-4 pb-3">
                  //     <p className="text-gray-900 dark:text-white">{post.content}</p>
                  //   </div>

                  //   {/* Post Image */}
                  //   {
                  //     post.image &&
                  //     (
                  //       <img
                  //         src={post.image}
                  //         alt="Post"
                  //         width={800}
                  //         height={600}
                  //         className="w-full h-auto"
                  //         loading="lazy"
                  //         decoding="async"
                  //       />
                  //     )
                  //   }

                  //   {/* Post Actions */}
                  //   <div className="flex items-center justify-between px-4 py-3 border-t dark:border-gray-800">
                  //     <div className="flex items-center gap-8">
                  //       <button
                  //         onClick={() => toggleLike(post._id)}
                  //         className={`flex items-center gap-1.5 transition-colors ${isLiked
                  //           ? "text-red-500"
                  //           : "text-gray-600 dark:text-gray-400 hover:text-red-500"
                  //           }`}
                  //       >
                  //         <svg
                  //           className="h-6 w-6"
                  //           fill={isLiked ? "currentColor" : "none"}
                  //           viewBox="0 0 24 24"
                  //           stroke="currentColor"
                  //           strokeWidth={2}
                  //         >
                  //           <path
                  //             strokeLinecap="round"
                  //             strokeLinejoin="round"
                  //             d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  //           />
                  //         </svg>
                  //         <span>
                  //           {
                  //             likeCount
                  //           }
                  //         </span>
                  //       </button>

                  //       <Link to={`/post/${post._id}/comment`}>
                  //         <button className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                  //           <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  //           </svg>
                  //           <span>
                  //             {
                  //               post.comments.length
                  //             }
                  //           </span>
                  //         </button>
                  //       </Link>

                  //       <Popover>
                  //         <PopoverTrigger asChild>
                  //           <button className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                  //             <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367 2.684m0-5.368a3 3 0 10-5.367 2.684m6.632 3.316l-6.632 3.316" />
                  //             </svg>
                  //             <span>0</span>
                  //           </button>
                  //         </PopoverTrigger>

                  //         <PopoverContent className="w-72 p-0" align="end">
                  //           <Command className="rounded-lg border shadow-md">
                  //             <CommandList>
                  //               <CommandGroup>
                  //                 <CommandItem className="cursor-pointer flex items-center gap-3 px-4 py-3 text-sm">
                  //                   <Link2 className="h-4 w-4" />
                  //                   <span onClick={() => handleCopyLink(post._id)}>Copy link</span>
                  //                 </CommandItem>
                  //               </CommandGroup>
                  //             </CommandList>
                  //           </Command>
                  //         </PopoverContent>
                  //       </Popover>
                  //     </div>
                  //   </div>
                  // </div>
                );
              }))}
        </div>
      </div>
    </>
  );
};