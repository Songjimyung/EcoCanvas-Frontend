import React, { useEffect, useState } from "react";
import './chatList.css'
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function ChatList() {
    const [chatList, setChatList] = useState([]);
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        const getChatList = async () => {
            const token = localStorage.getItem('access');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/chat/info/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            setChatList(result);
        };

        getChatList();
    }, []);

    useEffect(() => {
        const getUserData = async () => {
            const userIds = chatList.map(chatItem => chatItem.advisee);
            const token = localStorage.getItem('access');
            const fetchUserPromises = userIds.map(async userId => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}/`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                    });
                    const result = await response.json();
                    return result;
                } catch (error) {
                    console.error(error);
                    return null;
                }
            });
            const users = await Promise.all(fetchUserPromises);
            setUserList(users);
        };

        getUserData();
    }, [chatList]);
    return (
    <div>
        <h1>Chat List</h1>
        {userList.map((user, index) => (
            <div key={index}>
                <h2>{user.email}</h2>
                <Link to={`/chat?id=${chatList[index].id}`}>
                <Button style={{ fontSize: '20px', color: 'red', margin: 'auto' }}>채팅</Button>
                </Link>
            </div>
        ))}
    </div>
    )
}

    
export { ChatList };
