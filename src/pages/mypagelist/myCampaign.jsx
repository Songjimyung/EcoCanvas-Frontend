import React, { useEffect, useState } from "react";
import Pagination from '@mui/material/Pagination';
import Sidebar from "../../components/mypageSidebar/MypageSidebar"
import '../../css/mypage.css'
import { Link } from 'react-router-dom';
import campaign_default_image from '../../img/campaign_default_image.jpg';


const MyPostCampaign = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [campaignData, setCampaignData] = useState([])
  const cardsPerPage = 5;
  useEffect(() => {
    const token = localStorage.getItem('access');

    fetch(`${process.env.REACT_APP_BACKEND_URL}/campaigns/mypage/participant/`, {
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
          campaign_end_date: campaign.campaign_end_date,
          activity_start_date: campaign.activity_start_date,
          activity_end_date: campaign.activity_end_date,
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
  return (
    <div>
      <div className="mypage-block">
        <Sidebar /><div className="card-section">
          {currentCards.length > 0 ? (
            currentCards.map((card, index) => (
              <div className="card" key={index}>
                <Link to={`/campaign/${card.id}`}>
                  {card.image ? (
                    <img src={`${process.env.REACT_APP_BACKEND_URL}${card.image}`} alt={card.title} style={{ width: '200px', height: '200px' }} />
                  ) : (
                    <img src={campaign_default_image} alt="Default Campaign" style={{ width: '200px', height: '200px' }} />
                  )}
                </Link>
                <Link to={`/campaign/${card.id}`}>
                  <h3>{card.title}</h3>
                </Link>
                <p>캠페인 현황 : <span style={{ color: 'blue' }}>{card.status}</span></p>
                <p>캠페인 마감일: {card.campaign_end_date}</p>
                <p>활동 시작일 : {card.activity_start_date}</p>
                <p>활동 마감일 : {card.activity_start_date}</p>
              </div>
            ))
          ) : (
            <h2>캠페인 작성 내역이 없습니다.</h2>
          )
          }
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
    </div>
  );
};


export { MyPostCampaign };