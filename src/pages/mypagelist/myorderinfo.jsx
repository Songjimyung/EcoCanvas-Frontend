import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/mypageSidebar/MypageSidebar";
import "../../css/mypage.css";
import { Button, Grid, Typography, TextField } from "@mui/material";
import DaumPostcode from "react-daum-postcode";
import { Modal } from "antd";

export default function MyOrderInfo() {
  const [userData, setUserData] = useState({
    address: "",
    zipcode: "",
    detailAddress: "",
    contact: "",
    deliveryMessage: "",
  });
  const [phonenum, setPhoneNum] = useState('');
  const phoneRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [Address, setAddress] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [zipcode, setZipcode] = useState('');

  const onToggleModal = () => {
    setIsOpen((prev) => !prev);
  };
  const handleComplete = (data) => {

    setAddress(data.address);
    setZipcode(data.zonecode);
    setIsComplete(true);
    onToggleModal();
  };


  const handlePhone = (e) => {
    const value = e.target.value.replace(/\D+/g, "");
    const numberLength = 11;

    let result = "";

    for (let i = 0; i < value.length && i < numberLength; i++) {
      switch (i) {
        case 3:
          result += "-";
          break;
        case 7:
          result += "-";
          break;

        default:
          break;
      }

      result += value[i];
    }

    e.target.value = result;

    setPhoneNum(result);
  };

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
        setPhoneNum(result.receiver_number);

      } catch (error) {

      }
    };

    fetchUserData();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");

    const formData = new FormData();
    formData.append("address", isComplete ? Address : userData.address);
    formData.append("zip_code", isComplete ? zipcode : userData.zipcode);
    formData.append("detail_address", userData.detailAddress);
    formData.append("delivery_message", userData.deliveryMessage);
    formData.append("receiver_number", phonenum);

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
      if (response.ok) {
        await response.json();
        alert("저장 완료!")
        window.location.reload();
      } else {
        const data = await response.json();
        const errorValues = Object.values(data);
        throw new Error(errorValues.join('\n'));
      }
    } catch (error) {
      alert(error);
    }
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
                value={isComplete ? Address : userData.address}
                onChange={(e) =>
                  setUserData({ ...userData, address: e.target.value })
                }
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                className="addProductButton"
                onClick={onToggleModal}
                sx={{ color: "white" }}
              >
                주소 검색
              </Button>
              {isOpen && (
                <Modal
                  visible={true}
                  onOk={onToggleModal}
                  onCancel={onToggleModal} // isOpen이 false가 되고 화면이 리렌더되면서 모달 사라짐
                >
                  <DaumPostcode onComplete={handleComplete} />
                </Modal>
              )}
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
                type="tel"
                name="contact"
                ref={phoneRef}
                value={phonenum}
                onChange={handlePhone}
                maxLength="13"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">우편번호</Typography>
              <TextField
                name="zipcode"
                value={isComplete ? zipcode : userData.zipcode}
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
          </div>
        </form>
      </div>
    </div>
  );
}

export { MyOrderInfo };
