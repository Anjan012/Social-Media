import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link as LinkIcon, MapPin, Users } from "lucide-react";
import { Navbar } from "../components/ui/shared/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon, EllipsisVertical } from "lucide-react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Trash2,
  Edit,
  Bookmark,
  Flag,
  Copy,
  Share2,
  VolumeX,
  UserMinus,
} from "lucide-react";

export const Home = ({
  displayName = "@Anjan_012",
  // avatarUrl = "https://github.com/shadcn.png",
  avatarUrl = "default_profile.jpg",
  postsCount = 35,
  isFollowing = false,
}) => {
  const [user, setUser] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postData, setPostData] = useState({
    content: ""
  });

  const isOwnPost = true;

  useEffect(() => {
    const POST_URL = '/api/v1/posts';

    const fetchAllPost = async () => {
      const response = await axios.get(POST_URL, { withCredentials: true });
      setPosts(response.data.posts);
    }

    fetchAllPost();
  }, []);


  const handleInput = (event) => {
    const { name, value } = event.target;
    setPostData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

   const validateInput = () => {
    if (!postData.content.trim()) {
      toast.error("Content is Empty");
      return false;
    }
    return true;
  }

  const handleCreatePost = async (event) => {
    event.preventDefault();
    try {
      if (!validateInput()) { return };
      const CREATE_POST_URL = '/api/v1/posts';
      const dataToSend = {
        content: postData.content
      }
      const response = await axios.post(CREATE_POST_URL, dataToSend,
        { withCredentials: true }
      );

      if (response.status === 201) {
        toast("Post Created Successfully");
      }

      setPostData({ content: "" });

    }
    catch (error) {
      console.log(error);
    }
  }

  const handleDeletePost = async (postId) => {
    try {
     
      const DELETE_URL = `/api/v1/posts/${postId}`;
      const response = await axios.delete(
        DELETE_URL, 
        {withCredentials:true}
      );

      if(response.status === 200){
        toast(`Post deleted successfully ${postId}`);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }
  return (
    <>
      <Navbar />
      <div className="w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-6 mt-5">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback className="bg-red-500 text-white">
                  {displayName?.[0] || "?"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <Textarea
                  placeholder="What's on your mind?"
                  className="min-h-[80px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent dark:bg-transparent px-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  name="content"
                  onChange={handleInput}
                  value={postData.content}
                />

                {/* File preview (if user selects image/video) */}
                {/* You would use state + URL.createObjectURL to show preview here */}

                <div className="flex items-center justify-between border-t dark:border-gray-800 pt-3">
                  <div className="flex items-center gap-4">
                    <Label
                      htmlFor="post-image"
                      className="cursor-pointer flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                      <ImageIcon className="h-5 w-5" />
                      <span>Photo/Video</span>
                      <Input
                        id="post-image"
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                      // onChange={handleFileChange}  ← add your handler later
                      />
                    </Label>
                  </div>

                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white px-6"
                    onClick={handleCreatePost}
                  >
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {
            posts.map((post) => {
              return (
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden my-1" key={post._id}>

                  {/* Post Header */}
                  <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={avatarUrl} alt="User" />
                        <AvatarFallback className="bg-red-500 text-white">AH</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {post.createdBy.username}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          @{post.createdBy.fullname} • {post.createdAt}
                        </p>
                      </div>
                    </div>

                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                          <EllipsisVertical className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </button>
                      </PopoverTrigger>

                      <PopoverContent className="w-72 p-0" align="end">
                        <Command className="rounded-lg border shadow-md">
                          <CommandList>
                            {/* For your own post */}
                            {isOwnPost && (
                              <CommandGroup>
                                <CommandItem
                                  // onSelect={() => handleEditPost(post.id)}
                                  className="cursor-pointer flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent"
                                >
                                  <Edit className="h-4 w-4" />
                                  <span>Edit post</span>
                                </CommandItem>

                                <CommandItem
                                  onSelect={() => handleDeletePost(post._id)}
                                  className="cursor-pointer flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span>Delete</span>
                                </CommandItem>
                              </CommandGroup>
                            )}

                            {/* Common actions - always visible */}
                            <CommandGroup>
                              <CommandItem className="cursor-pointer flex items-center gap-3 px-4 py-3 text-sm">
                                <Bookmark className="h-4 w-4" />
                                <span>Save post</span>
                              </CommandItem>

                              <CommandItem className="cursor-pointer flex items-center gap-3 px-4 py-3 text-sm">
                                <Copy className="h-4 w-4" />
                                <span>Copy link</span>
                              </CommandItem>

                              <CommandItem className="cursor-pointer flex items-center gap-3 px-4 py-3 text-sm">
                                <Share2 className="h-4 w-4" />
                                <span>Share to...</span>
                              </CommandItem>
                            </CommandGroup>

                            <Separator />

                            {/* Report / Hide / Mute actions */}
                            <CommandGroup>
                              <CommandItem className="cursor-pointer flex items-center gap-3 px-4 py-3 text-sm">
                                <Flag className="h-4 w-4" />
                                <span>Report post</span>
                              </CommandItem>

                              <CommandItem className="cursor-pointer flex items-center gap-3 px-4 py-3 text-sm">
                                <VolumeX className="h-4 w-4" />
                                <span>Mute
                                  {/* {post.author.username} */}
                                </span>
                              </CommandItem>

                              {!isOwnPost && (
                                <CommandItem className="cursor-pointer flex items-center gap-3 px-4 py-3 text-sm">
                                  <UserMinus className="h-4 w-4" />
                                  <span>Unfollow {post.author.username}</span>
                                </CommandItem>
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                  </div>

                  {/* Post Content */}
                  <div className="px-4 pb-3">
                    <p className="text-gray-900 dark:text-white">
                      {post.content}
                    </p>
                  </div>

                  {/* Post Image */}
                  <img src={post.image || "default_post.png"} />

                  {/* Post Actions */}
                  <div className="flex items-center justify-between px-4 py-3 border-t dark:border-gray-800">
                    <div className="flex items-center gap-8">
                      <button className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>1.2K</span>
                      </button>

                      <button className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>347</span>
                      </button>

                      <button className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367 2.684m0-5.368a3 3 0 10-5.367 2.684m6.632 3.316l-6.632 3.316" />
                        </svg>
                        <span>89</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div >
    </>
  )
}
