import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import axios from "axios";

export const CommentPage = () => {
    // Dummy Post Data
    // const [post] = useState({
    //     _id: "post123",
    //     content: "Design a System Like YouTube:  A Comprehensive Guide to Building a Scalable Video Sharing Platform",
    //     image: "https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5237f88e-8a2c-4e0b-8457-3dfabd2d6ca3_1329x1536.gif",
    //     createdAt: "2h ago",
    //     createdBy: {
    //         username: "Mr. kitty",
    //         fullname: "Anjan Khadka",
    //         avatar: "https://scontent.fktm10-1.fna.fbcdn.net/v/t39.30808-6/480851821_663409292696283_3102048845438794153_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=53a332&_nc_eui2=AeHQDJg8t9H2ZaZFdAy0ngiLPI64wAVM5Z88jrjABUzln9yVAHX10BVMk2dhtTUhPRG_Kn5u1Vz7-CRhSYtLoz8R&_nc_ohc=QoZZ7Cjek_sQ7kNvwHUJ1q3&_nc_oc=AdqsOqC7gZ8wEiLPL1pWyAg8p00HPWtWEMLKYC1G7ogKmANyAVc_maICWUtO9q2sssAcaMLSNpSHzsvPFS9QUeUz&_nc_zt=23&_nc_ht=scontent.fktm10-1.fna&_nc_gid=PoArfLDW0mtuKDU0fo_HKQ&_nc_ss=7a32e&oh=00_AfxfzsUSz9HhBev888MFChLvTy3xx2mYcmqKsrvhJTw_Sw&oe=69CE8B6C",
    //     },
    //     likes: ["user1", "user2", "user3"], // dummy user ids
    // });

    // Dummy Comments
    const [comments, setComments] = useState([
        {
            _id: "c1",
            user: {
                username: "Saloni 🌸",
                fullname: "Saloni Sharma",
                avatar: "https://i.pinimg.com/736x/df/f8/68/dff868c27d6bda120aa86ca794cfb323.jpg",
            },
            text: "What else we can do to make the youtube like system ? 🤔",
            likes: 12,
            createdAt: "1h ago",
            isLiked: false,
        },
        {
            _id: "c2",
            user: {
                username: "Sunil Pahari",
                fullname: "sunil pahari",
                avatar: "https://scontent.fktm7-1.fna.fbcdn.net/v/t39.30808-6/650773559_954714750346967_6092372836403014587_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=1d70fc&_nc_eui2=AeFy3r50behdpDY-FV9KtfLiimr-CpIy8dSKav4KkjLx1N1hyAvPRi5jWZezO6gfpruXXaAIObSXzTp9gDzlwmHR&_nc_ohc=f0zUocFfzt0Q7kNvwE2HIUa&_nc_oc=AdrvsoQT8MEDFyRI3641vKnppEkvRxXJzdkTc8G3w1pSiXz-P53Fdcc4adpiz1K4mXU2aTgwt1s5WITZwDmR07JV&_nc_zt=23&_nc_ht=scontent.fktm7-1.fna&_nc_gid=aP2rylQwLcGpiiHrxm7FYw&_nc_ss=7a32e&oh=00_AfwN31z5VZajdC4B56Rj-thP-hyGGoJNwQ1jUkWEWCuLzQ&oe=69CE8D88",
            },
            text: "noicee!!",
            likes: 5,
            createdAt: "20m ago",
            isLiked: false,
        },
        {
            _id: "c3",

            user: {
                username: "Kreety",
                fullname: "kreety KC",
                avatar: "https://i.pinimg.com/736x/1a/d8/4b/1ad84b9ab4a1e2ab17c7aab37fcff0a5.jpg",
            },
            text: "anyone can suggest some good resources to learn backend development for building such systems ? 🤣",
            likes: 8,
            createdAt: "45m ago",
            isLiked: true,
        },
        {
            _id: "c4",

            user: {
                username: "Risap",
                fullname: "kreety KC",
                avatar: "https://scontent.fktm10-1.fna.fbcdn.net/v/t39.30808-6/559424001_828203149560819_7743829855196049894_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=1d70fc&_nc_eui2=AeGXmk-4dOC81TnRf1skeAURhJAaUMHF1NmEkBpQwcXU2bZk0wLWN68EqW3CnomatFJ4CJaTx4xNg-SqPOo311J9&_nc_ohc=0iQDCwqt914Q7kNvwGEiSqk&_nc_oc=AdqBxVQ_RsO8B_op4hRKMQ5OTY034Tq1prvtS_3ducA3V17VLbEeTW4kLbusOqyaJAMyfPUOn4s1zdfkeeyjVEpQ&_nc_zt=23&_nc_ht=scontent.fktm10-1.fna&_nc_gid=3J8n1V5IAVETo3Y1NEf_Ww&_nc_ss=7a32e&oh=00_AfwsYLj1eXGUVN9bsabxoZJXnv_snLiDjUIh5iRM7CTrMQ&oe=69CEABDA",
            },
            text: "Sutt chomu, Elon Musk is going to buy youtube and make it free for everyone 😎",
            likes: 8,
            createdAt: "47m ago",
            isLiked: false,
        },

        {
            _id: "c5",

            user: {
                username: "testuser",
                fullname: "test user",
                avatar: "https://i.pinimg.com/1200x/2b/20/d6/2b20d628e5916c7fa3db298c5130ca24.jpg",
            },
            text: "test comment",
            likes: 8,
            createdAt: "1m ago",
            isLiked: false,
        },
    ]);

    const [post, setPost] = useState({});
    const [newComment, setNewComment] = useState("");
    const [postIsLiked, setPostIsLiked] = useState(false); // for the main post like


    // Add new comment
    const handlePostComment = () => {
        if (!newComment.trim()) return;

        const comment = {
            _id: Date.now().toString(),
            user: {
                username: "anjan", // replace with your authUser.username later
                fullname: "Anjan",
                avatar: "https://i.pravatar.cc/150?img=68",
            },
            text: newComment,
            likes: 0,
            createdAt: "Just now",
            isLiked: false,
        };

        setComments([comment, ...comments]); // add at top
        setNewComment("");
        toast.success("Comment posted successfully!");
    };

    // Like/Unlike main post
    const togglePostLike = () => {
        setPostIsLiked(!postIsLiked);
        toast.info(postIsLiked ? "Like removed" : "Post liked ❤️");
    };

    // Like/Unlike a comment
    const toggleCommentLike = (commentId) => {
        setComments((prev) =>
            prev.map((comment) =>
                comment._id === commentId
                    ? { ...comment, isLiked: !comment.isLiked, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1 }
                    : comment
            )
        );
    };

    const { id } = useParams();
    const POST_URL = `/api/v1/posts/${id}`;

    const getPost = () => {

        axios.get(POST_URL, { withCredentials: true })
            .then((response) => {
                setPost(response.data.post);
            })
            .catch((error) => {
                console.error("Error fetching post:", error);
            });

        //   console.log("Post data:", post);

    }

    //   getPost();
    //   console.log("Fetched post data:", post);

    useEffect(() => {
        console.log("Fetching post data...");
        getPost();
    }, []);

    console.log("Post data from state:", post);

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
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {post.createdBy?.username || undefined}
                            </p>
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
                    className="w-full object-cover max-h-[500px]"
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
                    <Avatar className="h-9 w-9 flex-shrink-0">
                        <AvatarImage src="https://scontent.fktm10-1.fna.fbcdn.net/v/t39.30808-6/480851821_663409292696283_3102048845438794153_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=53a332&_nc_eui2=AeHQDJg8t9H2ZaZFdAy0ngiLPI64wAVM5Z88jrjABUzln9yVAHX10BVMk2dhtTUhPRG_Kn5u1Vz7-CRhSYtLoz8R&_nc_ohc=QoZZ7Cjek_sQ7kNvwHUJ1q3&_nc_oc=AdqsOqC7gZ8wEiLPL1pWyAg8p00HPWtWEMLKYC1G7ogKmANyAVc_maICWUtO9q2sssAcaMLSNpSHzsvPFS9QUeUz&_nc_zt=23&_nc_ht=scontent.fktm10-1.fna&_nc_gid=PoArfLDW0mtuKDU0fo_HKQ&_nc_ss=7a32e&oh=00_AfxfzsUSz9HhBev888MFChLvTy3xx2mYcmqKsrvhJTw_Sw&oe=69CE8B6C" />
                        <AvatarFallback>AN</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <Textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write your comment..."
                            className="min-h-[80px] resize-y bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-blue-500"
                        />

                        <div className="flex justify-end mt-3">
                            <Button
                                onClick={handlePostComment}
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
                    Comments ({comments.length})
                </h3>

                {comments.map((comment) => (
                    <div
                        key={comment._id}
                        className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800"
                    >
                        <div className="flex gap-3">
                            <Avatar className="h-9 w-9 flex-shrink-0">
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
                                        onClick={() => toggleCommentLike(comment._id)}
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

                {comments.length === 0 && (
                    <p className="text-center text-gray-500 py-10">No comments yet. Be the first to comment!</p>
                )}
            </div>
        </div>
    );
};