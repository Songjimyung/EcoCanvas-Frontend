import React, { useEffect, useRef } from 'react';

const NotificationReceiver = () => {
  const socket = new WebSocket('ws://localhost:8000/ws/restock/');  // WebSocket 연결 URL

  socket.onopen = () => {
    console.log('연결 성공');

    // notification_group 그룹 구독 요청
    socket.send(JSON.stringify({
      command: 'subscribe',
      group: 'notification_group'
    }));
  };
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const message = data.message;
    console.log('받은 메세지', message);
  };
  socket.onclose = () => {
    console.log('WebSocket 연결 종료');
  };

  return (
    <div>
      <h1>test</h1>
    </div>
  );

};

export default NotificationReceiver;
