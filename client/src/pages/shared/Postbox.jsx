import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon, EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {AuthContext} from "../../context/AuthContext";
import { useContext } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export const PostBox = (
    {
        displayName = "@Anjan_012",
    },
) => {
    const [media, setMedia] = useState(null);
    const [isPosting, setIsPosting] = useState(false);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [postData, setPostData] = useState({
        content: ""
    });
    const handleInput = (event) => {
        const { name, value } = event.target;
        setPostData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const { authUser } = useContext(AuthContext);

    const handleCreatePost = async (e) => {
        e.preventDefault();

        try {
            setIsPosting(true);
            const formData = new FormData();
            if (postData.content.trim()) {
                formData.append("content", postData.content);
            }

            if (media) {
                formData.append("media", media); // 🔥 MUST MATCH multer
            }

            if (!postData.content.trim() && !media) {
                toast.error("Post content or media is required");
                return;
            }

            const response = await axios.post(
                `${API_URL}/api/v1/posts`,
                formData,
                {
                    withCredentials: true,
                    // headers: {
                    //     "Content-Type": "multipart/form-data",
                    // },
                }
            );

            if (response.status === 201) {
                toast.success("Post created successfully");
            }

            setPostData({ content: "" });
            setMedia(null);
        } catch (error) {
            console.error(error);
            toast.error("Failed to create post");
        } finally {
            setIsPosting(false);``
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setMedia(file);
        setMediaPreview(URL.createObjectURL(file));

    }


    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-6 mt-5">
            <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={authUser?.profilePicture || "default_profile.jpg"} alt={displayName} />
                    <AvatarFallback className="bg-red-500 text-white">
                        {displayName?.[0] || "?"}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4 min-w-0">
                    <Textarea
                        placeholder="What's on your mind?"
                        className="w-full min-h-20 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent dark:bg-transparent px-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        name="content"
                        onChange={handleInput}
                        value={postData.content}
                    />


                    {
                        media && (
                            <div className="relative w-full max-w-xs ">
                                <img
                                    src={mediaPreview}
                                    alt="Uploaded preview"
                                    className="w-full h-auto rounded-lg object-cover max-h-64 "
                                />
                            </div>
                        )
                    }
                    <div className="flex items-center justify-between border-t dark:border-gray-800 pt-3">
                        <div className="flex items-center gap-4">
                            <Label
                                htmlFor="post-image"
                                className="cursor-pointer flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            >

                                <ImageIcon className="h-5 w-5" name="image" />
                                <span>Photo/Video</span>
                                <Input
                                    id="post-image"
                                    type="file"
                                    accept="image/*,video/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </Label>
                        </div>

                        <Button
                            className="bg-red-500 hover:bg-red-600 text-white px-6"
                            onClick={handleCreatePost}
                            disabled={isPosting || (!postData.content.trim() && !media)}
                        >
                            {isPosting ? "Posting..." : "Post"}
                        </Button>

                    </div>
                </div>
            </div>
        </div>
    )
};