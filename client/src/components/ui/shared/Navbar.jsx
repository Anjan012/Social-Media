import React, { useEffect, useState } from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { User2, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const Navbar = () => {

    const [user, setUser] = useState([]);

    const PROFILE_URL = "/api/user/profile";


    const getProfile = async () => {
        const response = await axios.get(PROFILE_URL, { withCredentials: true });
        setUser(response.data.user);
        console.log("user")
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-14 sm:h-16 items-center justify-between">

                        <div className="flex-shrink-0">
                            <Link to="/" className="flex items-center gap-2">
                                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-red-500 hover:text-red-600 transition-colors">
                                    MyApp
                                </span>
                            </Link>
                        </div>

                        <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-12 justify-center">
                            <div className="relative w-full max-w-lg">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 border border-gray-300 focus:border-red-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-300 transition-all text-gray-800 placeholder-gray-500"
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2 md:gap-6">

                            <button className="md:hidden p-2 rounded-full hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            <Link to="/"
                                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                </svg>
                                <span className="font-medium">Home</span>
                            </Link>

                            <a href="/" className="md:hidden p-2 rounded-full hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </a>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar onClick={getProfile}>
                                        <AvatarImage src="default_profile.jpg" />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className='w-80'>
                                    <div className="flex gap-5 space-y-2">
                                        <Avatar className="cursor-pointer" >
                                            <AvatarImage src={user.image || "default_profile.jpg"} />
                                        </Avatar>
                                        <div>
                                            <h4 className="font-medium">{user.username}</h4>
                                            <p className="text-sm text-muted-foreground">{user?.bio?.slice(0, 20) + "..."}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col text-gray-600 my-2">
                                        <div className="flex w-fit items-center gap-2 cursor-pointer">
                                            <User2 />
                                            <Link to="/profile">
                                                <Button variant="link" >View Profile</Button>
                                            </Link>
                                        </div>
                                        <div className="flex w-fit items-center gap-2 cursor-pointer">
                                            <LogOut />
                                            <Link to="/signin">
                                                <Button variant="link" >Logout</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>



                        </div>

                    </div>
                </div>
            </nav>

            <div className="h-14 sm:h-16"></div>
        </>
    )
}
