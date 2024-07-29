import React, { useState, useRef, useEffect } from 'react';
import { HiOutlinePencilAlt, HiTrash } from "react-icons/hi";
import { IoTimeOutline } from 'react-icons/io5';
import { useDrag } from 'react-dnd';
import Modal from 'react-modal';

const ItemType = 'CARD';

type Priority = 'Low' | 'Medium' | 'Urgent';

const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
        case 'Low':
            return 'bg-green-400';
        case 'Medium':
            return 'bg-yellow-300';
        case 'Urgent':
            return 'bg-red-500';
        default:
            return 'bg-gray-200';
    }
};

interface Card {
    _id: string;
    title: string;
    description: string;
    deadline: string;
    priority: Priority;
    createdAt: string;
}

interface DraggableCardProps {
    card: any;
    onDelete: (id: string) => void;
    onClick?: () => void;
}

const DraggableCard: React.FC<DraggableCardProps> = ({ card, onDelete, onClick }) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: { id: card._id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            drag(ref.current);
        }
    }, [drag]);

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(card.title);
    const [editDescription, setEditDescription] = useState(card.description);
    const [editDeadline, setEditDeadline] = useState(card.deadline);
    const [editPriority, setEditPriority] = useState(card.priority);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!editTitle.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!editDescription.trim()) {
            newErrors.description = 'Description is required';
        }
        if (!editDeadline.trim()) {
            newErrors.deadline = 'Deadline is required';
        }
        if (!editPriority) {
            newErrors.priority = 'Priority is required';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleEdit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update/${card._id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    title: editTitle,
                    description: editDescription,
                    deadline: editDeadline,
                    priority: editPriority,
                }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (response.ok) {
                const updatedCard = await response.json();
                setEditTitle(updatedCard.title);
                setEditDescription(updatedCard.description);
                setEditDeadline(updatedCard.deadline);
                setEditPriority(updatedCard.priority);
                setIsEditing(false);
                window.location.reload();
            } else {
                console.error('Failed to update card on the server');
            }
        } catch (error) {
            console.error('Error updating card:', error);
        }
    };

    const handleDelete = () => {
        onDelete(card._id);
    };

    return (
        <div ref={ref} className="card bg-gray-100 mb-2 rounded opacity-80" style={{ opacity: isDragging ? 0.5 : 1 }}>
            <div className="flex flex-col ml-auto mr-auto justify-between p-4 rounded-lg bg-indigo-200">
                <div>
                    <h3 className="text-lg font-bold">{card.title}</h3>
                    <p className='mt-2'>{card.description}</p>
                    <p className={`text-md text-gray-700 py-1 px-2 w-fit mt-4 rounded-md ${getPriorityColor(card.priority)}`}>
                        {card.priority}
                    </p>
                    <p className="text-md text-gray-600 flex flex-row mt-2 items-center">
                        <IoTimeOutline className='mr-1'/> 
                        {new Date(card.deadline).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-8 mt-2">Created at: {new Date(card.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex flex-row ml-auto mt-4">
                    <button className="text-white py-1 px-1 rounded mr-1 bg-green-500 hover:bg-green-700" onClick={() => setIsEditing(true)}><HiOutlinePencilAlt/></button>
                    <button className="text-white py-1 px-1 rounded bg-red-500 hover:bg-red-700" onClick={handleDelete}><HiTrash/></button>
                </div>
            </div>
            <Modal
                isOpen={isEditing}
                onRequestClose={() => setIsEditing(false)}
                contentLabel="Edit Card"
                className="modal bg-white p-4 rounded-lg shadow-md"
                overlayClassName="overlay bg-gray-500 bg-opacity-50 fixed inset-0"
            >
                <h2>Edit Card</h2>
                <input
                    required
                    type="text"
                    placeholder="Title"
                    className="border p-2 mb-2 w-full"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                />
                {errors.title && <p className="text-red-500">{errors.title}</p>}
                <input
                    required
                    type="text"
                    placeholder="Description"
                    className="border p-2 mb-2 w-full"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                />
                {errors.description && <p className="text-red-500">{errors.description}</p>}
                <input
                    required
                    type="date"
                    placeholder="Deadline"
                    className="border p-2 mb-2 w-full"
                    value={editDeadline}
                    onChange={(e) => setEditDeadline(e.target.value)}
                />
                {errors.deadline && <p className="text-red-500">{errors.deadline}</p>}
                <select
                    className="border p-2 mb-2 w-full"
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                >
                    <option value="">Select Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="Urgent">Urgent</option>
                </select>
                {errors.priority && <p className="text-red-500">{errors.priority}</p>}
                <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700" onClick={handleEdit}>
                    Save
                </button>
                <button className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700 ml-2" onClick={() => setIsEditing(false)}>
                    Cancel
                </button>
            </Modal>
        </div>
    );
};

export default DraggableCard;
