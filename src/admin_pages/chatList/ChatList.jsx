import React, { useEffect, useState } from "react";
import './chatList.css'
import { Button } from '@mui/material';
import Modal from "../../components/modal/Modal";
import ChatDetail from "../chatDetail/ChatDetail";

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

  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const openChatModal = (userId) => {
    setSelectedUserId(userId);
    setChatModalOpen(true);
  };
  const closeChatModal = () => {
    window.location.reload();
    setSelectedUserId(null);
    setChatModalOpen(false);
  };


  return (
    <div>
      <h1>Chat List</h1>
      {userList.map((user, index) => (
        <div key={index}>
          <h2>{user.email}</h2>
          <Button onClick={() => openChatModal(chatList[index].id)}>상담하기</Button>
          <Modal open={chatModalOpen} close={closeChatModal} header="상담">
            {selectedUserId && <ChatDetail id={selectedUserId} />}
          </Modal>
        </div>
      ))}
    </div>
  )
}

export { ChatList };
