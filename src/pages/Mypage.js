import React, { useEffect, useState } from "react";
import Pagination from '@mui/material/Pagination'; import Sidebar from "../components/mypageSidebar/MypageSidebar"
import '../components/mypageSidebar/mypageSidebar.css'
import { format } from 'date-fns';

const Mypage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [campaignData, setCampaignData] = useState([])
  const cardsPerPage = 10;
  useEffect(() => {
    const token = localStorage.getItem('access');

    fetch("http://127.0.0.1:8000/campaigns/mypage/attend/", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => response.json(
      console.log(response)
    ))
      .then(result => {
        const campaigns = result.map((campaign) => ({
          id: campaign.id,
          title: campaign.title,
          content: campaign.content,
          members: campaign.members,
          current_members: campaign.current_members,
          campaign_end_date: format(new Date(campaign.campaign_end_date), 'yyyy-MM-dd'),
          activity_start_date: format(new Date(campaign.activity_start_date), 'yyyy-MM-dd'),
          activity_end_date: format(new Date(campaign.activity_end_date), 'yyyy-MM-dd'),
          image: campaign.image
        }));
        console.log(result)
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
    <>
      <div className="mypage-block">
        <Sidebar /><div className="card-section">
          {currentCards.map((card, index) => (
            <div className="card" key={index}>
              <h3>{card.title}</h3>

              <p>{card.content}</p>
              <p>모집인원 : {card.members}</p>
              <p>참가인원 : {card.current_members}</p>
              <p>캠페인 마감일: {card.campaign_end_date}</p>
              <p>활동 시작일 : {card.activity_start_date}</p>
              <p>활동 마감일 : {card.activity_start_date}</p>
            </div>
          ))}
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