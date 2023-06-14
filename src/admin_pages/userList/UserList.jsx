import React, { useEffect, useState } from "react";

import './userList.css'
import { Link } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid'
// import { DeleteOutline } from "@mui/icons-material";

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'status', headerName: 'Status', width: 130 },
  {
    field: 'action',
    headerName: 'Action',
    width: 150,
    renderCell: (params) => {
      return (
        <>
          <Link to={'/users/' + params.row.id}>
            <button className="userListEdit">수정</button>
          </Link>
        </>
      )
    }
  }
]


export default function UserList() {
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('access');
    console.log(token)
    fetch("http://127.0.0.1:8000/users/list/", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => response.json())
      .then(result => {
        const users = result.map((user, index) => ({
          id: user.id,
          email: user.email,
          name: user.username,
          status: user.is_active,
        }));
        setUserList(users);
      })
  }, []);
  return (

    <div className="userList">
      <div className="userListContainer">
        <h1 className="userTitle">유저 리스트</h1>
        <Link to='/createUser'>
          <button className="userAddButton">유저 생성</button>
        </Link>
      </div>
      <DataGrid
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } }
        }}
        rows={userList}
        disableRowSelectionOnClick
        columns={columns}
        pageSizeOptions={[5, 10, 15]}
        checkboxSelection
      />

    </div>
  )
}