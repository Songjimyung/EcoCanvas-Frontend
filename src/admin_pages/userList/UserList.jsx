import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import './userList.css'


export default function UserList() {
  const [userList, setUserList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handlePageChange = async (event, page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchUserList = async () => {
      const token = localStorage.getItem('access');

      try {
        let url = `${process.env.REACT_APP_BACKEND_URL}/users/list/`;
        url += `?page=${currentPage}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserList(response.data.results);
        const totalPages = Math.ceil(response.data.count / 6);
        setTotalPages(totalPages);

      } catch (error) {

      }
    };

    fetchUserList();
  }, [currentPage]);


  return (
    <div className="userList">
      <div className="userListContainer">
        <h1 className="userTitle">유저 리스트</h1>
      </div>
      <Card variant="outlined" className="user-card">
        <CardContent className="user-cardContent">
          <Typography variant="body1">이메일</Typography>
          <Typography variant="body1">이름</Typography>
          <Typography variant="body1">활성여부</Typography>
          <Typography variant="body1">등급</Typography>
          <Typography variant="body1">상세보기</Typography>
        </CardContent>
      </Card>
      {userList.map((user) => (
        <Card key={user.id} variant="outlined" className="user-card">
          <CardContent className="user-cardContent">
            <Typography variant="body1">{user.email}</Typography>
            <Typography variant="body1">{user.username}</Typography>
            <Typography variant="body1">
              {user.is_active ? "Active" : "Inactive"}
            </Typography>
            <Typography variant="body1">
              {user.is_admin ? "관리자" : "일반유저"}
            </Typography>
            <Link to={`/admin-users/${user.id}`}>
              <Button
                variant="contained"
                color="primary"
              >
                상세
              </Button>
            </Link>
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

}


export { UserList };
