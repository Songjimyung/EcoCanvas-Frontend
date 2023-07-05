import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination'; import Sidebar from "../components/mypageSidebar/MypageSidebar"
import '../css/mypage.css'
import { isAfter } from 'date-fns';
import { Link } from 'react-router-dom';
import campaign_default_image from '../img/campaign_default_image.jpg';
import { format } from 'date-fns';

const Mypage = () => {
  // 비로그인 시 주소창 접근 제한
  const navigate = useNavigate();
  const token = localStorage.getItem('access')

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [navigate, token]);

  const [selectedInfo, setSelectedInfo] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: ""
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [campaignData, setCampaignData] = useState([])
  const cardsPerPage = 5;
  useEffect(() => {
    const token = localStorage.getItem('access');

    fetch(`${process.env.REACT_APP_BACKEND_URL}/campaigns/mypage/attend/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => response.json(
    ))
      .then(result => {
        const campaigns = result.map((campaign) => ({
          id: campaign.id,
          title: campaign.title,
          content: campaign.content,
          campaign_end_date: format(new Date(campaign.campaign_end_date), 'yyyy-MM-dd'),
          activity_start_date: format(new Date(campaign.activity_start_date), 'yyyy-MM-dd'),
          activity_end_date: format(new Date(campaign.activity_end_date), 'yyyy-MM-dd'),
          image: campaign.image,
          status: campaign.status
        }));
        setCampaignData(campaigns)
      })
  }, []);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = campaignData.slice(indexOfFirstCard, indexOfLastCard);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const selectedImage = files[0];
      setFormData({ ...formData, image: selectedImage });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };


  const handleFormSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');

    const formData = new FormData();
    formData.append('image', e.target.elements.image.files[0]);
    formData.append('title', e.target.elements.title.value);
    formData.append('content', e.target.elements.content.value);

    fetch(`${process.env.REACT_APP_BACKEND_URL}/campaigns/review/${selectedInfo}/`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {

        alert("리뷰 등록 완료!")
        window.location.reload();
      })
      .catch((error) => {

      });
  };


  //모달 open, close
  const openModal = (campaignId) => {
    setSelectedInfo(campaignId);

    const modal = document.getElementById("Reivewmodal");
    modal.style.display = "block";
  };
  const closeModal = () => {
    setSelectedInfo(null);
    const modal = document.getElementById("Reivewmodal");
    modal.style.display = "none";
  };


  const today = new Date();
  return (
    <>
      <div className="mypage-block">
        <Sidebar /><div className="card-section">
          {currentCards.length > 0 ? (
            currentCards.map((card, index) => (
              <div className="card" key={index}>
                <Link to={`/campaign/${card.id}`}>
                  {card.image ? (
                    <img src={`${card.image}`} alt={card.title} style={{ width: '200px', height: '200px' }} />
                  ) : (
                    <img src={campaign_default_image} alt="Default Campaign" style={{ width: '200px', height: '200px' }} />
                  )}
                </Link>
                <Link to={`/campaign/${card.id}`}>
                  <h3>{card.title}</h3>
                </Link>
                <p>캠페인 현황: <span style={{ color: 'blue' }}>{card.status}</span></p>
                <p>캠페인 마감일: {card.campaign_end_date}</p>
                <p>활동 시작일: {card.activity_start_date}</p>
                <p>활동 마감일: {card.activity_end_date}</p>
                {isAfter(today, new Date(card.activity_end_date)) && card.status === 4 && (
                  <button onClick={() => openModal(card.id)}>리뷰 작성</button> // 활동종료일이 현재보다 지났고, 활동이 정상 종료 되었다면 버튼 표시
                )}
              </div>
            ))
          ) : (
            <h2>캠페인 참가 내역이 없습니다.</h2>
          )}
        </div>
      </div>
      <div id="Reivewmodal" className="modal">
        <div className="modal-content">
          <span className="close-button" onClick={closeModal}>&times;</span>
          {selectedInfo && (
            <div>
              {currentCards.map((user) => {
                if (user.id === selectedInfo) {
                  return (
                    <form className="addProductForm" onSubmit={handleFormSubmit}>
                      <div className="addProductItem">
                        <label>제목</label>
                        <input type="text" name="title" placeholder="제목 입력란" onChange={handleInputChange}></input>
                      </div>
                      <div className="addProductItem">
                        <label>리뷰 작성란</label>
                        <input type="text" name="content" placeholder="캠페인 후기를 남겨주세요" onChange={handleInputChange}></input>
                      </div>
                      <div className="addProductItem">
                        <label>리뷰 이미지</label>
                        <input type="file" id="file" name="image" onChange={handleInputChange} multiple />
                      </div>
                      <button className="addProductButton">작성하기</button>
                    </form>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>
      </div>
      <div className="pagination-container">
        <Pagination
          count={Math.ceil(campaignData.length / cardsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          size="large"
        />
      </div>
    </>
  );
};

export { Mypage };