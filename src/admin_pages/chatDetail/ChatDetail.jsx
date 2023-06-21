
import React, { useEffect, useState, useRef } from "react";
import './chatDetail.css'
import axios from "axios";
import { useLocation } from 'react-router-dom';

export default function ChatDetail() {
    const chatLogRef = useRef(null);
    const chatMessageInputRef = useRef(null);
    const chatMessageSendRef = useRef(null);
    let chatSocket = useRef(null);
    let payload = localStorage.getItem('payload');
    payload = JSON.parse(payload)
    const userId = payload.user_id
    const token = localStorage.getItem('access')
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    const [roomId, setRoomId] = useState('');

    useEffect(() => {
        async function getRoomId() {
            if (id) {
                setRoomId(id)
            }
            else {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/chat/room/`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                })
                setRoomId(response.data.id)
            }
        }
        getRoomId()

        chatMessageInputRef.current.focus();

        chatMessageInputRef.current.onkeyup = function (e) {
            if (e.keyCode === 13) {
                chatMessageSendRef.current.click();
            }
        };

        chatMessageSendRef.current.onclick = function () {
            if (chatMessageInputRef.current.value.length === 0) return;
            chatSocket.current.send(JSON.stringify({
                "message": chatMessageInputRef.current.value,
                'user_id': userId,
                'command': 'new_message'
            }));
            chatMessageInputRef.current.value = "";
        };

    }, []);

    useEffect(() => {
        connect();
        return () => {
            chatSocket.current.close();
        };
    }, [roomId]);

    function connect() {
        chatSocket.current = new WebSocket(`${process.env.REACT_APP_WEBSOCK_URL}/chat/${roomId}/?token=${token}`);

        chatSocket.current.onopen = function (e) {
            console.log("Successfully connected to the WebSocket.");
            chatSocket.current.send(JSON.stringify({
                'command': 'fetch_messages',
                'user_id': userId,
            }));
        };
            
        chatSocket.current.onclose = function (e) {
            console.error("WebSocket connection closed unexpectedly.");
        };
        chatSocket.current.onmessage = function (e) {
            const data = JSON.parse(e.data);
            console.log(e);
            if (data['command'] === 'messages') {
                for (let i = 0; i < data['messages'].length; i++) {
                    createMessage(data['messages'][i]);
                }
            } else if (data['command'] === 'new_message') {
                createMessage(data['message']);
            }

            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
        };

        chatSocket.current.onerror = function (err) {
            console.log("WebSocket encountered an error: " + err.message);
            chatSocket.current.onclose();
        };
    }
    function createMessage(data) {
        const author = data['author'];
        chatLogRef.current.value += (author + ': ' + data.content + '\n');
    }
    return (
        <div>
            <textarea id="chatLog" ref={chatLogRef} readOnly></textarea>
            <input type="text" id="chatMessageInput" ref={chatMessageInputRef} />
            <button id="chatMessageSend" ref={chatMessageSendRef}>Send</button>
        </div>
    );
}
export { ChatDetail };