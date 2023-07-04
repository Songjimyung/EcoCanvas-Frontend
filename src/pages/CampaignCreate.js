import React from 'react';
import '../css/campaign.css'
import ImageHeader from '../components/imageheader/ImageHeader';
import CampaignForm from '../campaign/CampaignForm';
import campaign_child from '../img/campaign_child.jpg';

// Stepper
import VerticalLinearStepper from '../campaign/CampaignStepper'

// CampaignCreate
const CampaignCreate = () => {
  return (
    <div className='campaignCreateForm'>
      <ImageHeader
        h1Text="Campaign"
        pText="캠페인 신청하기"
        imageUrl={campaign_child}
      />
      <VerticalLinearStepper />
      <CampaignForm />
    </div >
  );
};

export { CampaignCreate };