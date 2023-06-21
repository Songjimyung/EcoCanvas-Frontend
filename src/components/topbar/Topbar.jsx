import React, { useState, useEffect } from 'react';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import './topbar.css';
import { Link } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';



export default function Topbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [socket, setSocket] = useState(null);
  const [open, setOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);

  const handleClose = () => {
    setOpen(false);
    setNotificationCount(0);
  };

  const handleSnackbarOpen = (message) => {
    setNotificationMessage(message);
    setOpen(true);
    setNotificationCount((prevCount) => prevCount + 1);
    console.log(message)
  };
  useEffect(() => {

    const newSocket = new WebSocket('ws://localhost:8000/ws/restock/');  // WebSocket 연결 URL
    setSocket(newSocket);


    newSocket.onopen = () => {
      console.log('연결 성공');

      // notification_group 그룹 구독 요청
      newSocket.send(JSON.stringify({
        command: 'subscribe',
        group: 'notification_group'
      }));

    };
    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const message = data.message;
      handleSnackbarOpen(message);

    };
    newSocket.onclose = () => {
      console.log('WebSocket 연결 종료');
    };

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    // 로그인 상태를 localstorage에서 확인
    const loggedInStatus = localStorage.getItem('access');
    if (loggedInStatus) {
      setIsLoggedIn(true);
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('payload');
    setIsLoggedIn(false);
    socket.close();
    alert("로그아웃 되었습니다.")
  };

  return (
    <div className='_topbar'>
      <div className='_topbarWrapper'>
        <div className='_topLeft'></div>
        <div className='_topbarWrapper'>
          <div>
            <h2>
              <Link to='/' className='_topMiddle'>
                ECO CANVAS
              </Link>
            </h2>
          </div>
        </div>
        <div className='_topRight'>
          {isLoggedIn ? (
            <span>
              <Link onClick={handleLogout} className="_signBtn">로그아웃</Link>
            </span>
          ) : (
            <span>
              <Link to="/login" className="_signBtn">로그인</Link>
            </span>
          )}
          |
          {isLoggedIn ? (
            <span>
              <Link to='/mypage' className='_signBtn'>마이페이지</Link>
            </span>
          ) : (
            <span>
              <Link to='/signup' className='_signBtn'>회원가입</Link>
            </span>
          )}
          <div className='_topbarIconContainer'>
            <NotificationsNoneIcon />
            {notificationCount > 0 && (
              <span className="_topIconBadge">{notificationCount}</span>
            )}
          </div>
        </div>
      </div>
      <div>
        {/* <Button
          variant="contained"
          color="primary"
          sx={{ color: 'white', marginLeft: '25px', }}
          onClick={openChatModal}
        >상담
        </Button>
        <Modal open={chatModalOpen} close={closeChatModal} header="상담">
          <ChatDetail />
        </Modal> */}
      </div>
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
}
