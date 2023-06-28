
import React, { useEffect, useState, useRef } from "react";
import './chatDetail.css'
import axios from "axios";
import Messages from "./messages/messages";

export default function ChatDetail(room) {
  const [messages, setMessages] = useState([])
  const chatMessageInputRef = useRef(null);
  const chatMessageSendRef = useRef(null);
  let chatSocket = useRef(null);
  let payload = localStorage.getItem('payload');
  payload = JSON.parse(payload)
  const userId = payload.user_id
  const email = payload.email
  const token = localStorage.getItem('access')
  const id = room.id
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

  }, [id, token, userId]);

  useEffect(() => {
    function connect() {
      chatSocket.current = new WebSocket(`${process.env.REACT_APP_WEBSOCK_URL}/chat/${roomId}/?token=${token}`);

      chatSocket.current.onopen = function (e) {
        chatSocket.current.send(JSON.stringify({
          'command': 'fetch_messages',
          'user_id': userId,
        }));
      };

      chatSocket.current.onclose = function (e) {
      };
      chatSocket.current.onmessage = function (e) {
        const data = JSON.parse(e.data);

        if (data['command'] === 'messages') {
          for (let i = 0; i < data['messages'].length; i++) {
            setMessages((messages) => [...messages, data['messages'][i]])
          }
        } else if (data['command'] === 'new_message') {
          setMessages((messages) => [...messages, data['message']])
        }
      };

      chatSocket.current.onerror = function (err) {
        chatSocket.current.onclose();
      };
    }
    connect();
    return () => {
      chatSocket.current.close();
    };
  }, [roomId, token, userId]);

  return (
    <div className="chatContainer">
      <div className='container'>
        <Messages messages={messages} name={email} />
        <input className="input" type="text" id="chatMessageInput" ref={chatMessageInputRef} placeholder="전송하려는 메시지를 입력하세요." />
        <button className="sendButton" id="chatMessageSend" ref={chatMessageSendRef}>Send</button>
      </div>
    </div>
  );
}
export { ChatDetail };
