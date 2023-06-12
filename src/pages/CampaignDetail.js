import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../css/campaign.css"
import campaign_default_image from "../img/campaign_default_image.jpg"

const CampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);


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

  const getImageUrl = (imagePath) => {
    return `http://localhost:8000${imagePath}`;
  };

  const onErrorImg = (e) => {
    e.target.src = campaign_default_image
  }

  return (
    <div>
      {campaign ? (
        <div>
          <h2>{campaign.title}</h2>
          <p>{campaign.content}</p>
          <img className="campaignImage" src={getImageUrl(campaign.image)} alt="campaign_image" onError={onErrorImg} />
          <p>주최자 : {campaign.user}</p>
          <p>모집 인원 : {campaign.current_members} / {campaign.members}</p>
          <p>캠페인 상태 : {campaign.status}</p>
          <p>활동 시작일 : {campaign.activity_start_date}</p>
          <p>활동 종료일 : {campaign.activity_end_date}</p>
          <p>신청 시작일 : {campaign.campaign_start_date}</p>
          <p>신청 종료일 : {campaign.campaign_end_date}</p>
          <button>좋아요 💕 {campaign.like.length}</button>
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
        <p>캠페인을 불러오지 못했습니다.</p>
      )}
    </div>
  );
};

export { CampaignDetail };
