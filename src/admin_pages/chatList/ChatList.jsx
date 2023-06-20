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

            })
            const result = await response.json()
            setChatList(result)
        };
        getChatList();
    }, []);
    
    useEffect(() => {
        const getUserData = async () => {
            const userIds = chatList.map(chatItem => chatItem.advisee);
            try {
                const token = localStorage.getItem('access');
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${userIds}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                const result = await response.json();
                setUserList(result);
            } catch (error) {
                console.error(error);
            }
        };

        if (chatList.length > 0) {
            getUserData();
        }
    }, [chatList]);
    return (
        <div>
            <h1>Chat List</h1>
            {chatList.map((chatItem) => {
                const user = userList.find(user => user.id === chatItem.advisee);
                return (
                    <div key={chatItem.id}>
                        <h2>{user ? user.email : "Unknown User"}</h2>
                        <Link to={`/chat?id=${chatItem.id}`}>
                            <Button style={{ fontSize: '20px', color: 'red', margin: 'auto' }}>채팅</Button>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}
export { ChatList };