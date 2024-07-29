"use client";
import Link from 'next/link';
import { useEffect } from "react";
import { useUserContext } from '../userContext';

/* eslint-disable jsx-a11y/anchor-is-valid */
export default function Header() {
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

    return (
        <header className='flex justify-center'>
            <div className='container flex flex-row'>
                <Link href='/' className='logo text-2xl font-bold'>Task Manager</Link>
                <nav className='flex flex-row ml-auto gap-4'>
                    {userEmail ? (
                        <div className='flex flex-col lg:flex-row items-center justify-center'>
                            <p>{userEmail}</p>
                            <a onClick={logout} className='bg-red-500 p-2 rounded-md m-2'>Logout</a>
                        </div>
                    ) : (
                        <>
                            <Link href='/login' className='text-xl'>Login</Link>
                            <Link href='/register' className='text-xl'>Register</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
