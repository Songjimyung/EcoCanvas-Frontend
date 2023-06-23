import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button } from "@mui/material";
import axios from 'axios';
import "./notificationhistory.css";
import Pagination from '@mui/material/Pagination';
import Grid from '@mui/material/Grid';


const NotificationHistory = () => {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);


  const handlePageChange = async (event, page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const NotifiCationList = async () => {
      const token = localStorage.getItem('access');

      try {
        let url = `${process.env.REACT_APP_BACKEND_URL}/users/notifications/`;
        url += `?page=${currentPage}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications(response.data.results);
        const totalPages = Math.ceil(response.data.count / 6);
        setTotalPages(totalPages);
        
      } catch (error) {
        
      }
    };

    NotifiCationList();
  }, [currentPage]);

  const handleConfirmClick = (notificationId) => {
    const token = localStorage.getItem('access');

    axios.delete(`${process.env.REACT_APP_BACKEND_URL}/users/notifications/`, {
      data: { notification_id: notificationId },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        
        alert("알림 삭제 완료")
        window.location.reload();
      })
      .catch((error) => {

        
      });
  };

  const handleDeleteAllClick = () => {
    const token = localStorage.getItem('access');

    axios.delete(`${process.env.REACT_APP_BACKEND_URL}/users/notifications/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        
        alert("알림 일괄 삭제 완료");
        setNotifications([]);
      })
      .catch((error) => {
        
      });
  };




  return (
    <div className="notification-cardWrapper">
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>알림 내역</h2>
      <div className='deleteBtnWrapper'>
        <Button
          variant="contained"
          color="secondary"
          className="delete-all-button"
          onClick={handleDeleteAllClick}
        >
          알림 일괄 삭제
        </Button>
      </div>
      {notifications.map((notification) => (
        <Card key={notification.id} variant="outlined" className="notification-card">
          <CardContent className="notification-cardContent">
            <Typography variant="body1">{notification.message}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleConfirmClick(notification.id)}
            >
              확인
            </Button>
          </CardContent>
        </Card>
      ))}
      <Grid container justifyContent="center">
        <Pagination
          count={totalPages}
          page={currentPage}
          color="primary"
          onChange={handlePageChange}
        />
      </Grid>
    </div>
  );
};

export default NotificationHistory;
