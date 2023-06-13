import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../css/campaign.css"
import campaign_default_image from "../img/campaign_default_image.jpg"

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';

// Mui Tab
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 5 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

// 정보 제공 고시
const infoAnnounce = `캠페인 정보 제공 고시[전자상거래 등에서의 상품 등의 정보제공에 관한 고시] 항목에 의거 [ECOCANVAS 본사직영]에 의해 등록된 정보입니다.
캠페인번호 2080799823
캠페인상태 모금 캠페인
부가세 면세여부 과세모금
영수증발행 발행가능 - 신용카드 전표, 온라인 현금영수증
사업자구분 법인사업자

필수 표기 정보 : 
전자상거래 등에서의 소비자보호법에 관한 법률에 의거하여 미성년자가 물품을 구매하는 경우, 법정대리인이 동의하지 않으면 미성년자 본인 또는 법정대리인이 구매를 취소할 수 있습니다.
ECOCANVAS는 해당 내용에 대하여 일체의 책임을 지지 않습니다.
ECOCANVAS의 결제시스템을 이용하지 않고 판매자와 직접 거래하실 경우 캠페인 관련 지원을 받지 못하거나 진행하신 모금과 상이한 캠페인이 진행되는 등의
피해가 발생할 수 있으니 유의 바랍니다.직거래로 인해 발생한 피해에 대해 ECOCANVAS는 책임을 지지 않습니다.
`
const InfoAnnounceMap = ({ text }) => {
  return (
    <div>
      {text.split("\n").map((txt, index) => (
        <span key={index}>
          {txt}
          <br />
        </span>
      ))}
    </div>
  );
};


const CampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState('');
  const [campaignReviews, setCampaignReview] = useState('');
  const [campaignComments, setCampaignComment] = useState('');

  // Tab 
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // 캠페인 디테일
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

  // 캠페인 댓글
  useEffect(() => {
    const fetchCampaignComment = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/campaigns/comment/${id}`);
        setCampaignComment(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching campaign comment:", error);
      }
    };
    fetchCampaignComment();
  }, [id]);

  // 캠페인 리뷰
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

      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="primary"
          aria-label="primary tabs example"
          centered
        >
          <Tab label="캠페인 댓글" {...a11yProps(0)} />
          <Tab label="캠페인 리뷰" {...a11yProps(1)} />
          <Tab label="캠페인 정보 제공 고시" {...a11yProps(2)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          {campaignComments.length > 0 ? (
            campaignComments.map((campaignComment) => (
              <div className="campaignCommentDiv" key={campaignComment.id}>
                <p>{campaignComment.content}</p>
                <span>{campaignComment.user}</span><br />
                <span>{campaignComment.created_at}</span><br />
              </div>
            ))
          ) : (
            <div className="campaignCommentDiv">
              <h2>작성된 댓글이 없습니다.</h2>
            </div>
          )}
          <h2>캠페인 댓글 작성란 추가 예정</h2>
        </TabPanel>
        <TabPanel value={value} index={1}>
          {campaignReviews.length > 0 ? (
            campaignReviews.map((campaignReview) => (
              <div className="campaignReviewDiv" key={campaignReview.id}>
                <h2>{campaignReview.title}</h2><br />
                <span>{campaignReview.user}</span><br />
                <span>{campaignReview.content}</span><br />
                <span>{campaignReview.created_at}</span><br />
              </div>
            ))
          ) : (
            <div className="campaignReviewDiv">
              <h2>작성된 리뷰가 없습니다.</h2>
            </div>
          )}
        </TabPanel>
        <TabPanel value={value} index={2}>
          <InfoAnnounceMap text={infoAnnounce} />
        </TabPanel>
      </Box>
    </>
  );
};

export { CampaignDetail };