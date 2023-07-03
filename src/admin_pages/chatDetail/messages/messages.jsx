import React, { useEffect, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Message from "./message/message";

import './Messages.css';

function Messages({ messages, name }) {
  const scrollableContainerRef = useRef(null);

  useEffect(() => {
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollToBottom();
    }
  }, [messages]);

  return (
    <Scrollbars
      autoHide
      autoHideTimeout={1000}
      autoHideDuration={200}
      ref={scrollableContainerRef}
      className="messages"
    >
      {messages.map((message, i) => (
        <div key={i}><Message message={message} name={name} /></div>
      ))}
    </Scrollbars>
  );
}

export default Messages;
