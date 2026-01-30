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

export function Profile({
  displayName = "@Anjan_012",
  avatarUrl = "https://github.com/shadcn.png",
  postsCount = 35,
  isFollowing = false,
}) {
  const [user, setUser] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postData, setPostData] = useState({
    content: ""
  });

  const isOwnPost = true;

  useEffect(() => {
    const PROFILE_URL = "/api/user/profile";
    const POST_URL = "/api/v1/userposts/";

    const getProfile = async () => {
      const response = await axios.get(PROFILE_URL, { withCredentials: true });
      setUser(response.data.user);
    };

    const getUserPost = async () => {
      const response = await axios.get(POST_URL, { withCredentials: true });
      setPosts(response.data.post);
    }

    getProfile();
    getUserPost();

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
        {/* Cover area */}
        <div className="h-32 sm:h-48 md:h-56 bg-linear-to-r from-red-400/20 to-purple-500/20 relative" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Avatar + main content overlapping cover */}
          <div className="relative -mt-16 sm:-mt-20 pb-6">
            {/* <div className="flex flex-col sm:flex-row sm:items-end sm:gap-6"> */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6 lg:gap-6">
              {/* Large avatar */}
              <div className="shrink-0 mx-auto sm:mx-0">
                <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 lg:mt-12 border-white dark:border-gray-900 shadow-xl">
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback className="text-4xl bg-red-500 text-white">
                    {displayName?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Info section */}
              <div className="flex-1 mt-4 sm:mt-20 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {user.username}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  {user.fullname}
                </p>

                {/* Stats */}
                <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-gray-900 dark:text-white">
                      {postsCount.toLocaleString()}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">Posts</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-gray-900 dark:text-white">
                      {user.followers?.length || 0}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">Followers</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-gray-900 dark:text-white">
                      {user.following?.length || 0}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">Following</span>
                  </div>
                </div>

                {/* Bio */}
                {user.bio && (
                  <p className="mt-3 text-gray-700 dark:text-gray-300 max-w-xl mx-auto sm:mx-0">
                    {user.bio}
                  </p>
                )}


                {/* Location & website */}
                <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                  {user.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  {user.website && (
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:underline"
                    >
                      <LinkIcon className="h-4 w-4" />
                      <span>{user.website}</span>
                    </a>
                  )}
                </div>

                {/* Buttons */}
                <div className="mt-5 flex flex-wrap justify-center sm:justify-start gap-3">
                  <Button
                    className={`min-w-[120px] ${isFollowing
                      ? "bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                      }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>

                  <Button variant="outline" className="min-w-[120px]">
                    Message
                  </Button>

                  <Button variant="ghost" size="icon">
                    <Users className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Tabs */}
          <div className="flex justify-center sm:justify-start gap-8 text-sm font-medium">
            <button className="pb-4 border-b-2 border-red-500 text-red-500">
              Posts
            </button>
            <button className="pb-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              Stories
            </button>
            <button className="pb-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              Photos
            </button>
            <button className="pb-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              Tagged
            </button>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-6">
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
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden" key={post._id}>

                  {/* Post Header */}
                  <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="https://github.com/shadcn.png" alt="User" />
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
                  <img src={post.image || "image"} />

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
  );
}