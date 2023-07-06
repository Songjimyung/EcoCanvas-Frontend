import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import '../css/campaign.css'
import ImageHeader from '../components/imageheader/ImageHeader';
import CampaignForm from '../campaign/CampaignForm';
import campaign_child from '../img/campaign_child.jpg';


// CampaignUpdate
const CampaignUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [existingCampaignData, setExistingCampaignData] = useState(null);

  const [userId, setUserId] = useState(null);
  const [campaignAuthorId, setCampaignAuthorId] = useState(null);

  const payload = localStorage.getItem("payload");
  useEffect(() => {
    if (payload) {
      const payloadObject = JSON.parse(payload);
      setUserId(payloadObject["user_id"]);
    }
  }, [payload]);

  const axiosCampaignDetail = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/campaigns/${id}/`);
      setExistingCampaignData(response.data)
      setCampaignAuthorId(response.data.user_id)
    } catch (e) {
      console.error(e)
    }
  };
  useEffect(() => {
    axiosCampaignDetail();
    if (campaignAuthorId !== userId) {
      alert("작성자 본인만 수정할 수 있습니다.")
      navigate(`/campaign/${id}`)
    }
    // eslint-disable-next-line
  }, [id, campaignAuthorId]);


  return (
    <>
      <ImageHeader
        h1Text="Campaign"
        pText="캠페인 수정하기"
        imageUrl={campaign_child}
      />
      <CampaignForm initialData={existingCampaignData} isUpdate />
    </>
  );
}

export { CampaignUpdate };