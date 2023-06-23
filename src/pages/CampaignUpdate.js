import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import '../css/campaign.css'
import ImageHeader from '../components/imageheader/ImageHeader';
import CampaignForm from '../campaign/CampaignForm';
import campaign_child from '../img/campaign_child.jpg';


// CampaignUpdate
const CampaignUpdate = () => {
  const { id } = useParams();
  const [existingCampaignData, setExistingCampaignData] = useState(null);

  const axiosCampaignDetail = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/campaigns/${id}/`);
      setExistingCampaignData(response.data)
    } catch (e) {
      console.error(e)
    }
  };
  useEffect(() => {
    axiosCampaignDetail();
    // eslint-disable-next-line
  }, [id]);

  return (
    <>
      <ImageHeader
        h1Text="캠페인 수정하기"
        pText="EcoCanvas Campaigns"
        imageUrl={campaign_child}
      />
      <CampaignForm initialData={existingCampaignData} isUpdate />
    </>
  );
}

export { CampaignUpdate };