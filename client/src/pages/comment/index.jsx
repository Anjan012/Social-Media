import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

export const CommentPage = () => {

    const [post, setPost] = useState({});
    const [newComment, setNewComment] = useState("");
    const [postIsLiked, setPostIsLiked] = useState(false); // for the main post like


    const handlePostComment = async (id) => {
        const COMMENT_URL = `https://social-media-backend-0jko.onrender.com/api/v1/posts/${id}/comment`;
        const commentData = {
            comment: newComment
        };
        const response = await axios.post(COMMENT_URL, commentData, { withCredentials: true });
        
        if(response.status === 200) {
            toast.success("Comment added successfully!");
            setNewComment("");
        }
        else{
            toast.error("Failed to add comment. Please try again.");
        }
    };

    // Like/Unlike main post
    const togglePostLike = () => {
        setPostIsLiked(!postIsLiked);
        toast.info(postIsLiked ? "Like removed" : "Post liked ❤️");
    };


    const { id } = useParams();
    const POST_URL = `https://social-media-backend-0jko.onrender.com/api/v1/posts/${id}`;

    const getPost = async () => {

        await axios.get(POST_URL, { withCredentials: true })
            .then((response) => {
                setPost(response.data.post);
            })
            .catch((error) => {
                console.error("Error fetching post:", error);
            });
    };

    useEffect(() => {
        getPost();
    }, []);

    const handleInput = (event) => {
        const { value } = event.target;
        setNewComment(value);
    }


    return (
        <div className="max-w-2xl mx-auto py-6 px-4 bg-gray-50 dark:bg-gray-950 min-h-screen">
            {/* Original Post */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden mb-6">
                {/* Post Header */}
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={`http://localhost:3000/${post.image}`} />
                            <AvatarFallback>AS</AvatarFallback>
                        </Avatar>
                        <div>
                            <Link to={`/profile/${post.createdBy?._id}`}>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {post.createdBy?.username || undefined}
                                </p>
                            </Link>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {post.createdBy?.fullname} • {post.createdAt}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3">
                    <p className="text-gray-900 dark:text-white leading-relaxed">
                        {post.content}
                    </p>
                </div>

                {/* Post Image */}
                <img
                    src={`http://localhost:3000/${post.image}`}
                    alt="post"
                    className="w-full object-cover max-h-125"
                />

                {/* Post Actions */}
                <div className="p-4 border-t dark:border-gray-800 flex items-center gap-6">
                    <button
                        onClick={togglePostLike}
                        className={`flex items-center gap-2 transition-colors ${postIsLiked ? "text-red-500" : "text-gray-600 dark:text-gray-400 hover:text-red-500"}`}
                    >
                        <Heart className="h-6 w-6" fill={postIsLiked ? "currentColor" : "none"} />
                        <span className="font-medium">
                            {post.likes?.length + (postIsLiked ? 1 : 0)}
                        </span>
                    </button>

                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MessageCircle className="h-6 w-6" />
                        <span className="font-medium">{post.comments?.length || 0}</span>
                    </div>
                </div>
            </div>

            {/* Comment Input Box */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-6">
                <div className="flex gap-3">
                    <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage src={`http://localhost:3000/${post.image}`} />
                        <AvatarFallback>AN</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <Textarea
                            onChange={handleInput}
                            value={newComment}
                            placeholder="Write your comment..."
                            className="min-h-20 resize-y bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-blue-500"
                        />

                        <div className="flex justify-end mt-3">
                            <Button
                                onClick={() => handlePostComment(post._id)}
                                disabled={!newComment.trim()}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                            >
                                <Send className="h-4 w-4" />
                                Post Comment
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white px-2 mb-3">
                    Comments ({post.comments?.length || 0})
                </h3>

                {post.comments?.map((comment) => (
                    <div
                        key={comment._id}
                        className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800"
                    >
                        <div className="flex gap-3">
                            <Avatar className="h-9 w-9 shrink-0">
                                <AvatarImage src={comment.user.avatar} />
                                <AvatarFallback>{comment.user.username[0].toUpperCase()}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {comment.user.username}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                            {comment.createdAt}
                                        </span>
                                    </div>
                                </div>

                                <p className="mt-1 text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {comment.text}
                                </p>

                                {/* Comment Actions */}
                                <div className="flex items-center gap-4 mt-3">
                                    <button
                                        className={`flex items-center gap-1.5 text-sm transition-colors ${comment.isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                                            }`}
                                    >
                                        <Heart
                                            className="h-4 w-4"
                                            fill={comment.isLiked ? "currentColor" : "none"}
                                        />
                                        <span>{comment.likes}</span>
                                    </button>

                                    <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                        Reply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {post.comments?.length === 0 && (
                    <p className="text-center text-gray-500 py-10">No comments yet. Be the first to comment!</p>
                )}
            </div>
        </div>
    );
};