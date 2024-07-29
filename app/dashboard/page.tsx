"use client";
import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CardColumn from '../components/CardColumn';
// import Modal from './Modal';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useUserContext } from '../userContext';
import Image from 'next/image';
import { CiCalendar } from "react-icons/ci";
import { VscSparkle } from "react-icons/vsc";
import { IoMdShare } from "react-icons/io";
import { RxQuestionMarkCircled } from "react-icons/rx";

interface Card {
    id: string;
    title: string;
    description: string;
    date: string;
    category: string;
}

function Profile() {
    const [cards, setCards] = useState<Card[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('title');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalDescription, setModalDescription] = useState('');
    const { setUserInfo, userInfo } = useUserContext();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const tasks: Card[] = await response.json();
                setCards(tasks);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();

        const handleRefresh = () => {
            fetchTasks();
        };

        window.addEventListener('refreshCards', handleRefresh);

        return () => {
            window.removeEventListener('refreshCards', handleRefresh);
        };
    }, []);

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

    const filteredCards = cards.filter(card =>
        card.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedCards = filteredCards.sort((a, b) => {
        if (sortBy === 'title') {
            return a.title.localeCompare(b.title);
        } else if (sortBy === 'date') {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        return 0;
    });

    const openModal = (title: string, description: string) => {
        setModalTitle(title);
        setModalDescription(description);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalTitle('');
        setModalDescription('');
    };

    const userEmail = userInfo?.email;
    return (
        <>
            {/* <Header /> */}
            <div className="flex">
                <Sidebar />
                <div className="relative flex-grow flex flex-col items-start justify-start bg-gradient-to-r from-indigo-200 to-yellow-100">
                    <div className='pl-12 pt-4'>
                        <div className='flex flex-row'>
                            <p className='text-3xl font-bold'>Good Morning, {userEmail}</p>
                            <div className='flex flex-row ml-auto items-center justify-center'>Help& feebback <RxQuestionMarkCircled className='ml-2'/></div>
                        </div>
                        <div className='flex flex-row mt-8'>
                            <div className='rounded-md w-4/12 p-4 bg-white flex flex-row items-center justify-center'>
                                <Image
                                    src="/tagsimage.png"
                                    width={50}
                                    height={50}
                                    alt="accessimage"
                                />
                                <div className='ml-4 flex flex-col'>
                                    <p className='text-xl font-bold'>Introducing tags</p>
                                    <p className='text-medium'>Easily categorize and find your notes by adding tags. Keep your workspace clutter-free and efficient.</p>
                                </div>
                            </div>
                            <div className='rounded-md ml-8 w-4/12 p-4 bg-white flex flex-row items-center justify-center'>
                                <Image
                                    src="/notesImage.png"
                                    width={50}
                                    height={50}
                                    alt="accessimage"
                                />
                                <div className='ml-4 flex flex-col'>
                                    <p className='text-xl font-bold'>Share Notes Instantly</p>
                                    <p className='text-medium'>Effortlessly share your notes with others via email or link. Enhance collaboration with quick sharing options.</p>
                                </div>
                            </div>
                            <div className='rounded-md ml-8 mr-12 p-4 w-4/12 bg-white flex flex-row items-center justify-center'>
                                <Image
                                    src="/accessImage.png"
                                    width={50}
                                    height={50}
                                    alt="accessimage"
                                />
                                <div className='ml-4 flex flex-col'>
                                    <p className='text-xl font-bold'>Access Anywhere</p>
                                    <p className='text-medium'>Sync your notes across all devices. Stay productive whether youre on your phone, tablet, or computer.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DndProvider backend={HTML5Backend}>
                        <div className="flex flex-col items-center p-12 w-full">
                            <div className="search-sort-controls mb-4 flex flex-col lg:flex-row w-full justify-between pt-4 px-4 bg-white bg-opacity-30 backdrop-blur-lg rounded-lg shadow-lg">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="border p-2 mb-4 w-full lg:w-1/5 rounded-md"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <div className='ml-auto flex flex-row items-start mt-2 justify-center'>
                                    <p className='ml-8 flex flex-row items-center justify-center'>Calender view <CiCalendar className='ml-2'/></p>
                                    <p  className='ml-8 flex flex-row items-center justify-center'>Automation <VscSparkle className='ml-2'/></p>
                                    <select
                                        className="border mb-4 ml-8 w-full lg:w-1/5 rounded-md"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="title">Sort by Title</option>
                                        <option value="date">Sort by Date</option>
                                    </select>
                                    <p className='ml-8 flex flex-row items-center justify-center'>Share <IoMdShare className='ml-2'/></p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row flex-wrap justify-between w-full bg-white bg-opacity-30 backdrop-blur-lg rounded-lg shadow-lg">
                                <CardColumn 
                                    title="To Do" 
                                    id="todo" 
                                    cards={sortedCards.filter(card => card.category === 'todo')} 
                                    onCardClick={openModal}
                                />
                                <CardColumn 
                                    title="In Progress" 
                                    id="inprogress" 
                                    cards={sortedCards.filter(card => card.category === 'inprogress')} 
                                    onCardClick={openModal}
                                />
                                <CardColumn 
                                    title="Done" 
                                    id="done" 
                                    cards={sortedCards.filter(card => card.category === 'done')} 
                                    onCardClick={openModal}
                                />
                                <CardColumn 
                                    title="In Review" 
                                    id="inreview" 
                                    cards={sortedCards.filter(card => card.category === 'inreview')} 
                                    onCardClick={openModal}
                                />
                            </div>
                        </div>
                    </DndProvider>
                </div>
            </div>
            {/* <Modal 
                show={isModalOpen} 
                onClose={closeModal} 
                title={modalTitle} 
                description={modalDescription} 
            /> */}
        </>
    );
}

export default Profile;
