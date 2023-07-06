import React, { useEffect, useState } from "react";
import "./mypageSidebar.css";
import { Link, useLocation } from "react-router-dom";
import SidebarItem from "../SidebarItem/SidebarItem";
import profile_default_image from "../../img/profile_default_image.png";
import { Button, Grid, Typography, TextField } from "@mui/material";
import Modal from "../../components/modal/Modal"

function Sidebar() {
  const [userData, setUserData] = useState([]);
  const [userId, setUserId] = useState();
  const [username, setUserName] = useState();
  const [image, setImage] = useState("");
  const [ModalOpen, setModalOpen] = useState(false);
  const [loginType, setLoginType] = useState(null);

  const getImageUrl = (imagePath) => {
    return `${imagePath}`;
  };
  const onErrorImg = (e) => {
    e.target.src = profile_default_image;
  };

  // URL의 path값을 받아오기
  const pathName = useLocation().pathname;

  //마이페이지 리스트
  const menus = [
    { name: "캠페인 참가 내역", path: "/mypage" },
    { name: "캠페인 작성 내역", path: "/mypage/mypostcampaign" },
    { name: "좋아요", path: "/mypage/mylikes" },
    { name: "리뷰/댓글", path: "/mypage/myreviews" },
  ];
  const menus1 = [
    { name: "주문내역", path: "/mypage/myorders" },
    { name: "배송지 등록", path: "/mypage/orderinfo" },

  ];
  const menus2 = [
    { name: "카드정보", path: "/mypage/mypayments" },
    { name: "예약결제확인", path: "/mypage/myschedule" },
  ];

  // payload에서 user_id 가져와서 GET요청
  useEffect(() => {
    const payload = localStorage.getItem("payload");
    if (payload) {
      const payloadObject = JSON.parse(payload);
      setUserId(payloadObject.user_id);
      if (payloadObject.login_type) {
        setLoginType(payloadObject.login_type);
      }
    }
  }, []);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access");
        let response;
        response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/users/profile/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          const user_info = {
            id: result["user"]["id"],
            email: result["user"]["email"],
            username: result["user"]["username"],
            image: result.image,
          };
          setUserData([user_info]);
        } else {
          // 응답이 실패인 경우
          const defaultUserInfo = {
            id: null,
            email: "프로필이 존재하지 않습니다.",
            username: "프로필이 존재하지 않습니다.",
            image: profile_default_image,
          };
          setUserData([defaultUserInfo]);
        }
      } catch (error) { }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
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


        setUserName(result.user.username);

      } catch (error) {

      }
    };

    fetchUserData();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");

    const formData = new FormData();
    formData.append("image", image);
    const userData = {
      username: username
    };

    formData.append("user", JSON.stringify(userData));

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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };





  return (
    <>
      <div className="mypage-sidebar-wrap1">
        <div className="mypage-wrap-top-left">
          <div className="myprofile-img-box">
            {userData.map((user) => (
              <img
                src={getImageUrl(user.image)}
                onError={onErrorImg}
                alt="profile_image"
              />
            ))}
          </div>
          <div>
            {userData.map((user) => {
              return (
                <div key={user.id} className="myprofile-info-box">
                  <p>{user.username}</p>
                  <p>{user.email}</p>
                  <button className="details-button" onClick={handleOpenModal} style={{ color: 'white' }}>
                    회원정보 수정
                  </button>
                  {!loginType && (
                    <button className="details-button">
                      <Link to="/update-pw">비밀번호 변경</Link>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="mypage-wrap-top-right">
          <div className="mypage-sidebar">
            <span>나의 캠페인</span>
            {menus.map((menu, index) => {
              return (
                <Link to={menu.path} key={index}>
                  <SidebarItem
                    menu={menu}
                    isActive={pathName === menu.path ? true : false} // 현재 URL pathname과 객체에 담긴 path값 일치 여부 확인
                  />
                </Link>
              );
            })}
          </div>
          <div className="mypage-sidebar">
            <span>나의 쇼핑</span>
            {menus1.map((menu, index) => {
              return (
                <Link to={menu.path} key={index}>
                  <SidebarItem
                    menu={menu}
                    isActive={pathName === menu.path ? true : false} // 현재 URL pathname과 객체에 담긴 path값 일치 여부 확인
                  />
                </Link>
              );
            })}
          </div>
          <div className="mypage-sidebar">
            <span>나의 결제</span>
            {menus2.map((menu, index) => {
              return (
                <Link to={menu.path} key={index}>
                  <SidebarItem
                    menu={menu}
                    isActive={pathName === menu.path ? true : false} // 현재 URL pathname과 객체에 담긴 path값 일치 여부 확인
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <Modal open={ModalOpen} close={handleModalClose} header="프로필 수정">
        <form onSubmit={handleFormSubmit} >
          <Grid container spacing={2} >
            <Grid item xs={12} style={{ textAlign: "center", width: "30%", margin: "auto" }}>
              <Typography variant="body1">이름변경</Typography>
              <TextField
                name="username"
                value={username}
                onChange={(e) =>
                  setUserName(e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} style={{ textAlign: "center", width: "70%", margin: "auto" }}>
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
      </Modal>
    </>
  );
}

export default Sidebar;
