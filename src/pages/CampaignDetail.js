import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../css/campaign.css"
import campaign_default_image from "../img/campaign_default_image.jpg"

import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

const CampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [campaignReview, setCampaignReview] = useState(null);


  // Tab 
  const [value, setValue] = React.useState('one');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  useEffect(() => {
    const fetchCampaignDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/campaigns/${id}`);
        setCampaign(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching campaign detail:", error);
      }
    };
    fetchCampaignDetail();
  }, [id]);

  useEffect(() => {
    const fetchCampaignReview = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/campaigns/review/${id}`);
        setCampaignReview(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching campaign review:", error);
      }
    };
    fetchCampaignReview();
  }, [id]);

  const getImageUrl = (imagePath) => {
    return `http://localhost:8000${imagePath}`;
  };

  const onErrorImg = (e) => {
    e.target.src = campaign_default_image
  }



  return (
    <>
      {campaign ? (
        <div className="campaignContentDiv">
          <h2>{campaign.title}</h2>
          <p>{campaign.content}</p>
          <img className="campaignImage" src={getImageUrl(campaign.image)} alt="campaign_image" onError={onErrorImg} />
          <p>주최자 : {campaign.user}</p>
          <p>모집 인원 : {campaign.current_members} / {campaign.members}</p>
          <p>캠페인 상태 : {campaign.status}</p>
          <p>활동 예정일 : {campaign.activity_start_date.substr(0, 13)} ~ {campaign.activity_end_date.substr(0, 13)}</p>
          <p>신청 시작일 : {campaign.campaign_start_date.substr(0, 13)}</p>
          <p>신청 종료일 : {campaign.campaign_end_date.substr(0, 13)}</p>
          <Button variant="contained" color="danger">
            좋아요 💕 {campaign.like.length}
          </Button>
          <Button variant="contained" color="primary">
            캠페인 참여하기
          </Button>
          <p>펀딩 여부 : {campaign.is_funding === true ? "O" : "X"}</p>
          {/* https://devbirdfeet.tistory.com/238 */}
          {campaign.fundings ? (
            <>
              <p>{campaign.fundings.current}원</p>
              <p>{campaign.fundings.goal}원</p>
            </>
          ) : (
            <p>펀딩 정보가 없는 캠페인입니다.</p>
          )}
        </div>
      ) : (
        <div className="campaignContentDiv">
          <h2>캠페인을 불러오지 못했습니다.</h2>
        </div>
      )}
      {campaignReview ? (
        <div className="campaignReviewDiv">
          <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              textColor="primary"
              indicatorColor="primary"
              aria-label="primary tabs example"
              centered
            >
              <Tab value="one" label="캠페인 리뷰" />
              <Tab value="two" label="캠페인 댓글" />
              <Tab label="Disabled" disabled />
            </Tabs>
          </Box>
        </div>
      ) : (
        <div className="campaignReviewDiv">
          <h2>캠페인 리뷰를 불러오지 못했습니다.</h2>
        </div>
      )}
    </>
  );
};



export { CampaignDetail };