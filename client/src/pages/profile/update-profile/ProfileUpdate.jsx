// pages/ProfileUpdate.tsx  (or wherever you place it)

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, X, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export const ProfileUpdate = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullname: "",
        username:"",
        bio: "",
        location: "",
        website: "",
    });

    const [profilePic, setProfilePic] = useState(null); // preview URL
    const [coverPic, setCoverPic] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const profilePicRef = useRef(null);
    const coverPicRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setProfilePic(previewUrl);
        }
    };

    const handleCoverPicChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setCoverPic(previewUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const submitData = {
            username: formData.fullname,
            fullname: formData.username,
            bio: formData.bio,
            location: formData.location,
            website: formData.website
        }

        // // Add files if selected
        // if (profilePicRef.current?.files?.[0]) {
        //     submitData.append("profilePicture", profilePicRef.current.files[0]);
        // }
        // if (coverPicRef.current?.files?.[0]) {
        //     submitData.append("coverPicture", coverPicRef.current.files[0]);
        // }

        try {
            const response = await axios.patch("/api/user/profile/update", submitData, {
              withCredentials: true,
            });

            if(response.status === 200){
                // Simulate success
            setTimeout(() => {
                toast("Profile updated successfully!");
                navigate("/profile");
            }, 1200);
            }
            
        } catch (err) {
            console.error(err);
            alert("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/user/profile", {
          withCredentials: true,
        });
        const userData = res.data.user;
        // Fill form with current values
        setFormData({
          fullname: userData.fullname || "",
          username: userData.username || "",
          bio: userData.bio || "",
          location: userData.location || "",
          website: userData.website || "",
        });

        // // Set current profile picture preview (from backend URL)
        // if (userData.profilePicture) {
        //   setProfilePicPreview(userData.profilePicture); // assume it's a URL
        // }
      } catch (err) {
        console.error("Failed to load profile", err);
        toast.error("Could not load your profile data");
      }
    };

    fetchProfile();
  }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 sm:px-2 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Card className="border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden">
                    {/* Cover / Banner Area */}
                    <div className="relative h-48 sm:h-64 bg-gradient-to-r from-red-400/30 to-purple-500/30">
                        {coverPic && (
                            <img
                                src={coverPic}
                                alt="Cover preview"
                                className="w-full h-full object-cover"
                            />
                        )}

                        {/* Upload cover button */}
                        <Label
                            htmlFor="cover-upload"
                            className="absolute bottom-4 right-4 cursor-pointer bg-black/60 hover:bg-black/80 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 backdrop-blur-sm transition-all"
                        >
                            <Camera className="h-4 w-4" />
                            Change cover
                        </Label>
                        <Input
                            id="cover-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={coverPicRef}
                            onChange={handleCoverPicChange}
                        />

                        {/* Remove cover preview button */}
                        {coverPic && (
                            <button
                                onClick={() => {
                                    setCoverPic(null);
                                    if (coverPicRef.current) coverPicRef.current.value = "";
                                }}
                                className="absolute top-4 right-4 bg-black/60 hover:bg-red-600/80 text-white p-2 rounded-full backdrop-blur-sm"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <CardHeader className="relative pb-0">
                        {/* Profile Picture – overlapping cover */}
                        <div className="absolute -top-16 left-6 sm:left-8">
                            <div className="relative group">
                                <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-white dark:border-gray-950 shadow-2xl">
                                    <AvatarImage src={profilePic || "/default-avatar.png"} alt="Profile" />
                                    <AvatarFallback className="bg-red-500 text-white text-4xl">
                                        {formData.fullname?.[0] || "?"}
                                    </AvatarFallback>
                                </Avatar>

                                {/* Camera overlay on hover */}
                                <Label
                                    htmlFor="profile-upload"
                                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                    <Camera className="h-8 w-8 text-white" />
                                </Label>

                                <Input
                                    id="profile-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={profilePicRef}
                                    onChange={handleProfilePicChange}
                                />
                            </div>
                        </div>

                        <div className="pt-20 sm:pt-24">
                            <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                Edit Profile
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                Update your public profile information
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="fullname">Full Name</Label>
                                    <Input
                                        id="fullname"
                                        name="fullname"
                                        value={formData.fullname}
                                        onChange={handleInputChange}
                                        placeholder="Anjan Thapa"
                                        className="focus:border-red-500 focus:ring-red-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        placeholder="@anjan_012"
                                        className="focus:border-red-500 focus:ring-red-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    placeholder="Write something about yourself..."
                                    className="min-h-[100px] focus:border-red-500 focus:ring-red-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="Kathmandu, Nepal"
                                        className="focus:border-red-500 focus:ring-red-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input
                                        id="website"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleInputChange}
                                        placeholder="https://yourwebsite.com"
                                        className="focus:border-red-500 focus:ring-red-500"
                                    />
                                </div>
                            </div>

                            <CardFooter className="flex justify-end gap-4 pt-6 border-t dark:border-gray-800 -mx-6 -mb-6 px-6 pb-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate("/profile")}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-red-600 hover:bg-red-700 min-w-[140px]"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                            </CardFooter>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}