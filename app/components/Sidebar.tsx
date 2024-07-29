"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from "react";
import { useUserContext } from '../userContext';
import { IoHomeOutline } from "react-icons/io5";
import { CiViewBoard, CiSettings } from "react-icons/ci";
import { LuUsers } from "react-icons/lu";
import { AiOutlineLineChart } from "react-icons/ai";

const Sidebar = () => {
    const pathname = usePathname();
    const { setUserInfo, userInfo } = useUserContext();

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
            method: 'POST',
            credentials: 'include',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setUserInfo(data);
        })
        .catch(error => {
            console.error('Error fetching profile:', error);
        });
    }, [setUserInfo]);

    function logout() {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
            method: 'POST',
            credentials: 'include',
        })
        .then(() => {
            setUserInfo(null);
        })
        .catch(error => {
            console.error('Error logging out:', error);
        });
    }
    const userEmail = userInfo?.email;
    const username = userInfo?.name;
    
    return (
        <div className="w-64 bg-gray-800 text-white flex flex-col">
            <div className="p-4 text-lg font-bold">Task Manager</div>
            <nav className="mt-4 flex flex-col space-y-2">
                <div className='flex flex-row items-center justify-center'>
                    <p className='text-md font-bold'>{userEmail}</p>
                    <a onClick={logout} className='bg-red-500 p-1 rounded-md m-2'>Logout</a>
                </div>
                <Link href="/dashboard" className={`p-2 flex flex-row items-center text-left ${pathname === '/dashboard' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                    <IoHomeOutline className='mr-2'/> Home
                </Link>
                <Link href="/boards" className={`p-2 flex flex-row items-center text-left ${pathname === '/boards' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                    <CiViewBoard className='mr-2'/> Boards
                </Link>
                <Link href="/settings" className={`p-2 flex flex-row items-center text-left ${pathname === '/settings' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                    <CiSettings className='mr-2'/> Settings
                </Link>
                <Link href="/teams" className={`p-2 flex flex-row items-center text-left ${pathname === '/teams' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                    <LuUsers className='mr-2'/> Teams
                </Link>
                <Link href="/analytics" className={`p-2 flex flex-row items-center text-left ${pathname === '/analytics' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                    <AiOutlineLineChart className='mr-2'/> Analytics
                </Link>
            </nav>
        </div>
    );
};

export default Sidebar;
