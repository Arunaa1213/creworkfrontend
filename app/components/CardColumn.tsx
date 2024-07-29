import React, { useState, useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import DraggableCard from './DraggableCard';
import Modal from 'react-modal';

const ItemType = 'CARD';

interface Card {
    _id: string;
    title: string;
    description: string;
    date: string;
    category: string;
    deadline: string;
    priority: string;
}

interface CardColumnProps {
    title: string;
    id: string;
    cards: any;
    onCardClick: (title: string, description: string) => void;
}

const CardColumn: React.FC<CardColumnProps> = ({ title, id, cards, onCardClick }) => {
    const [showModal, setShowModal] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newDeadline, setNewDeadline] = useState('');
    const [newPriority, setNewPriority] = useState('Low');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const addCard = () => {
        setShowModal(true);
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!newTitle.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!newDescription.trim()) {
            newErrors.description = 'Description is required';
        }
        if (!newDeadline.trim()) {
            newErrors.deadline = 'Deadline is required';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const saveCard = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/create`, {
                method: 'POST',
                body: JSON.stringify({
                    title: newTitle,
                    description: newDescription,
                    category: id,
                    deadline: newDeadline,
                    priority: newPriority,
                }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            setShowModal(false);
            setNewTitle('');
            setNewDescription('');
            setNewDeadline('');
            setNewPriority('Low');
            const event = new CustomEvent('refreshCards');
            window.dispatchEvent(event);
        } catch (error) {
            console.error('Error saving card:', error);
        }
    };

    const moveCard = async (cardId: string, newCategory: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/updateTask`, {
                method: 'POST',
                body: JSON.stringify({ taskId: cardId, newCategory }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (response.ok) {
                const event = new CustomEvent('refreshCards');
                window.dispatchEvent(event);
            } else {
                console.error('Failed to update card on the server');
            }
        } catch (error) {
            console.error('Error updating card:', error);
        }
    };

    const deleteCard = async (cardId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delete/${cardId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                const event = new CustomEvent('refreshCards');
                window.dispatchEvent(event);
            } else {
                console.error('Failed to delete card on the server');
            }
        } catch (error) {
            console.error('Error deleting card:', error);
        }
    };

    const [, drop] = useDrop({
        accept: ItemType,
        drop: (item: { id: string }) => moveCard(item.id, id),
    });

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            drop(ref.current);
        }
    }, [drop]);

    return (
        <div ref={ref} id={id} className="bg-white/20 backdrop-blur-sm shadow-md rounded-lg border border-indigo-300 p-4 w-full lg:w-[22%] min-h-[200px] h-fit mb-4 lg:mb-4 mx-0 lg:mx-4 mt-4">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <button className="bg-indigo-500 border border-indigo-500 text-white py-1 px-2 rounded hover:bg-transparent hover:border-indigo-500 hover:text-black" id={id} onClick={addCard}>
                Add Card
            </button>
            <Modal
                isOpen={showModal}
                onRequestClose={() => setShowModal(false)}
                contentLabel="Add Card Modal"
                className="modal"
                overlayClassName="modal-overlay"
            >
                <h2 className="text-xl font-bold mb-4">Add Card</h2>
                <input
                    required
                    type="text"
                    placeholder="Title"
                    className="border p-2 mb-2 w-full"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                />
                {errors.title && <p className="text-red-500">{errors.title}</p>}
                <input
                    required
                    type="text"
                    placeholder="Description"
                    className="border p-2 mb-2 w-full"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                />
                {errors.description && <p className="text-red-500">{errors.description}</p>}
                <input
                    required
                    type="date"
                    className="border p-2 mb-2 w-full"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                />
                {errors.deadline && <p className="text-red-500">{errors.deadline}</p>}
                <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="border p-2 mb-2 w-full"
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="Urgent">Urgent</option>
                </select>
                
                <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700" onClick={saveCard}>
                    Save
                </button>
                <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 ml-2" onClick={() => setShowModal(false)}>
                    Cancel
                </button>
            </Modal>
            <div className="mt-4">
                {cards.map((card: Card) => (
                    <DraggableCard 
                        key={card._id} 
                        card={card} 
                        onDelete={() => deleteCard(card._id)} 
                        onClick={() => onCardClick(card.title, card.description)}
                    />
                ))}
            </div>
        </div>
    );
}

export default CardColumn;
