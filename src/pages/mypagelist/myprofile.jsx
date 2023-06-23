import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/mypageSidebar/MypageSidebar";
import "../../css/mypage.css";
import { Button, Grid, Typography, TextField } from "@mui/material";

export default function MyProfile() {
  const [userData, setUserData] = useState({
    address: "",
    zipcode: "",
    detailAddress: "",
    contact: "",
    deliveryMessage: "",
  });
  const [image, setImage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/users/profile/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        

        const user_info = {
          address: result.address,
          zipcode: result.zip_code,
          detailAddress: result.detail_address,
          contact: result.receiver_number,
          deliveryMessage: result.delivery_message,
        };
        setUserData(user_info);
      } catch (error) {
        
      }
    };

    fetchUserData();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");
    if (
      !userData.address ||
      !userData.zipcode ||
      !userData.detailAddress ||
      !userData.contact ||
      !userData.deliveryMessage
    ) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    const formData = new FormData();
    formData.append("image", image);
    formData.append("address", userData.address);
    formData.append("zip_code", userData.zipcode);
    formData.append("detail_address", userData.detailAddress);
    formData.append("delivery_message", userData.deliveryMessage);
    formData.append("receiver_number", userData.contact);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/profile/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      const result = await response.json();

      if (result.errors) {
        
        alert(result.errors.user[0]);
      } else {
        
        alert("등록 완료!");
        window.location.reload();
      }
    } catch (error) {
      
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  return (
    <div className="mypage-block">
      <Sidebar />
      <div
        style={{ textAlign: "center", width: "30%", margin: "auto" }}
        className="info-update-box"
      >
        <h2>내 정보</h2>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1">배송지 주소</Typography>
              <TextField
                name="address"
                value={userData.address}
                onChange={(e) =>
                  setUserData({ ...userData, address: e.target.value })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">상세주소</Typography>
              <TextField
                name="detailAddress"
                value={userData.detailAddress}
                onChange={(e) =>
                  setUserData({ ...userData, detailAddress: e.target.value })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">연락처</Typography>
              <TextField
                name="contact"
                value={userData.contact}
                onChange={(e) =>
                  setUserData({ ...userData, contact: e.target.value })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">우편번호</Typography>
              <TextField
                name="zipcode"
                value={userData.zipcode}
                onChange={(e) =>
                  setUserData({ ...userData, zipcode: e.target.value })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">배송 메시지</Typography>
              <TextField
                name="deliveryMessage"
                value={userData.deliveryMessage}
                onChange={(e) =>
                  setUserData({ ...userData, deliveryMessage: e.target.value })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">프로필 이미지 업로드</Typography>
              <input
                type="file"
                accept="image/jpg,image/png,image/jpeg,image/gif"
                onChange={handleImageUpload}
              />
            </Grid>
          </Grid>
          <div className="button-box">
            <Button
              type="submit"
              sx={{
                width: "150px",
                backgroundColor: "rgb(129, 178, 20)",
                fontSize: "20px",
                color: "white",
                margin: "0px auto",
                transition: "0.2s",
                ":hover": {
                  backgroundColor: "rgb(32, 106, 93)",
                },
              }}
            >
              Save
            </Button>
            <Link to="/mypage/profile/withdrawal">회원탈퇴를 원하시나요?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export { MyProfile };
