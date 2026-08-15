import React from "react";
import { Navbar } from "../../components/ui/shared/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ProfileSection } from "./profile-page/ProfileSection";
import { ProfileTab } from "./profile-page/ProfileTab";
import { PostBox } from "../shared/Postbox";
import { ProfilePost } from "./profile-page/ProfilePost";

const API_URL = import.meta.env.VITE_API_URL;

export function Profile() {

  const { id } = useParams();
  const [profileData, setProfileData] = useState([]);
  const [user, setUser] = useState([]);
  const [posts, setPosts] = useState([]);


  useEffect(() => {
    const PROFILE_URL = `${API_URL}/api/v1/users/${id}`;

    const getProfile = async () => {
      const response = await axios.get(PROFILE_URL, { withCredentials: true });
      // setProfileData(response.data);
      // setUser(response.data.user);
      // setPosts(response.data.posts);
      console.log(response.data);
      setProfileData(response.data.userData);
      setUser(response.data.userData.user);
      setPosts(response.data.userData.posts);
    };

    getProfile();

  }, []);

  return (
    <>
      <Navbar />
      <div className="w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        {/* Cover area */}
        {
          user?.coverPicture ? (
            <img src={user.coverPicture} alt="Cover" className="w-full h-68 object-cover" />
          ) : (
            <div className="h-32 sm:h-48 md:h-56 bg-linear-to-r from-red-400/20 to-purple-500/20 relative" />
          )
        }
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProfileSection profileData={profileData} user={user} />
          <ProfileTab />
          <PostBox />
          <ProfilePost posts={posts} user={user} profileData={profileData} />
        </div>
      </div >
    </>
  );
}