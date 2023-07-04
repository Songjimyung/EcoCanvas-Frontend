import Sidebar from "../../components/mypageSidebar/MypageSidebar";
import "../../components/mypageSidebar/mypageSidebar.css";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";
import {
  Typography,
  TextField,
  Button,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem
} from "@mui/material";

const MyRefundreceipt = () => {
  const navigate = useNavigate();
  const [refundReason, setRefundReason] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [statusChoices, setStatusChoices] = useState([]);
  const [refundstatus, setRefundStatus] = useState("");
  const { id } = useParams();
  useEffect(() => {
    const fetchStatusChoices = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/payments/receipt/refund/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const filteredChoices = [2, 3, 4, 6].map((key) => ({
          value: key,
          label: response.data[key],
        }));
        setStatusChoices(filteredChoices);
        console.log(filteredChoices);
        console.log(statusChoices);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchStatusChoices();
  }, [id]);
 
  

  const handleRefundStatusChange = (e)  => {
    setRefundStatus(e.target.value);
  }

  const handleRefundReasonChange = (e) => {
    setRefundReason(e.target.value);
  };

  const handleRefundSubmit = () => {    
      setOpenDialog(true);
  }

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleSendRefund = async () => {
    console.log(refundstatus);
    if (refundstatus.value === 6) {
    try {
      const token = localStorage.getItem("access");
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/payments/receipt/refund/${id}`, {'status':refundstatus.value,'other_reason':refundReason},{
        headers: {
          'Authorization': `Bearer ${token}`
        }});
        console.log(refundstatus);
        console.log(refundReason);
        setOpenSnackbar(true);
        setOpenDialog(false);
        } catch(error){
        console.log(error.response.data)
        alert(error.response.data.message)
        }
    }
    else {
        try {
            const token = localStorage.getItem("access");
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/payments/receipt/refund/${id}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }});
              setOpenSnackbar(true);
              setOpenDialog(false);
              } catch(error){
              console.log(error)
              }

    }
               
  };
  const handleSnackbarClose = () => {
     setOpenSnackbar(false); 
     setTimeout(() => {
     navigate("/mypage/myorders");
     }, 1000);
  }
  return (
    <div className="mypage-block">
      <Sidebar />

      <Typography variant="h4" gutterBottom sx={{ margin: "50px auto 0px" }}>
        주문 취소 신청 페이지
      </Typography>
      <Select
        value={refundstatus}
        onChange={handleRefundStatusChange}
        sx={{ width: "700px", margin: "30px auto 30px" }}
        >
        {statusChoices.map((choice) => (
            <MenuItem key={choice.value} value={choice}>
            {choice.label}
            </MenuItem>
        ))}
      </Select>
      {refundstatus.value === 6 &&(
      <TextField
        label="환불 사유"
        fullWidth
        value={refundReason}
        onChange={handleRefundReasonChange}
        sx={{ width: "700px", margin: "30px auto 30px" }}
      />)}
      <Button
        variant="contained"
        onClick={handleRefundSubmit}
        sx={{
          width: "150px",
          height: "40px",
          margin: "0px auto",
          color: "white",
        }}
      >
        신청 제출
      </Button>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="주문 취소 신청이 제출되었습니다."
      />

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>주문 취소 신청 확인</DialogTitle>
        <DialogContent>
            {refundstatus.value=== 6 &&(
          <Typography>주문 취소 사유: {refundReason}</Typography>
            )}
            {refundstatus.value !== 6 &&(
          <Typography>주문 취소 사유: {refundstatus.label}</Typography>
            )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>닫기</Button>
          <Button onClick={handleSendRefund} variant="contained">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export { MyRefundreceipt };
