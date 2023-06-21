import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const NotificationReceiver = () => {
  const [open, setOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleClose = () => {
    setOpen(false);
  };

  const handleSnackbarOpen = (message) => {
    setNotificationMessage(message);
    setOpen(true);
  };

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
    handleSnackbarOpen(message);

  };
  socket.onclose = () => {
    console.log('WebSocket 연결 종료');
  };

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={9000}
        onClose={handleClose}
        message={notificationMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: 'midnightblue',
            color: 'white',
          },
        }}
      />
    </div>
  );

};

export default NotificationReceiver;
