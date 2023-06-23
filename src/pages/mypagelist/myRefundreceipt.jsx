import Sidebar from "../../components/mypageSidebar/MypageSidebar";
import "../../components/mypageSidebar/mypageSidebar.css";
import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const MyRefundreceipt = () => {
  const [refundReason, setRefundReason] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleRefundReasonChange = (e) => {
    setRefundReason(e.target.value);
  };

  const handleRefundSubmit = () => {
    // 환불 신청 제출
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="mypage-block">
      <Sidebar />

      <Typography variant="h4" gutterBottom sx={{ margin: "50px auto 0px" }}>
        환불 신청 페이지
      </Typography>
      <TextField
        label="환불 사유"
        fullWidth
        value={refundReason}
        onChange={handleRefundReasonChange}
        sx={{ width: "700px", margin: "30px auto 30px" }}
      />
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
        message="환불 신청이 제출되었습니다."
      />

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>환불 신청 확인</DialogTitle>
        <DialogContent>
          <Typography>환불 사유: {refundReason}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>닫기</Button>
          <Button onClick={handleSnackbarClose} variant="contained">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export { MyRefundreceipt };
