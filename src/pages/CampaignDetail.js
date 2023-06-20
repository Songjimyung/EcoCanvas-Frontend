import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../css/campaign.css"
import campaign_default_image from "../img/campaign_default_image.jpg"
import sharekakao from "../img/sharekakao.webp"

// MUI
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import ShareIcon from '@mui/icons-material/Share';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

// modal
import Modal from "../components/modal/Modal"

// share
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";
import { CopyToClipboard } from "react-copy-to-clipboard";

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
  // Detail GET
  const { id } = useParams();
  const [campaign, setCampaign] = useState('');
  const [campaignReviews, setCampaignReview] = useState('');
  const [campaignComments, setCampaignComment] = useState('');

  // comment POST
  const [createComment, setCreateComment] = useState('');

  // Tab 
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // 캠페인 디테일 GET
  const axiosCampaignDetail = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/campaigns/${id}/`);
      setCampaign(response.data);
      setLikeCount(response.data.like_count);
    } catch (error) {
      console.log(error)
    }
  };
  useEffect(() => {
    axiosCampaignDetail();
    // eslint-disable-next-line
  }, [id]);

  // 캠페인 댓글 GET
  const axiosCampaignComment = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/campaigns/comment/${id}/`);
      setCampaignComment(response.data);
    } catch (error) {
      console.log(error)
    }
  };
  useEffect(() => {
    axiosCampaignComment();
    // eslint-disable-next-line
  }, []);

  // 캠페인 후기 GET
  useEffect(() => {
    const axiosCampaignReview = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/campaigns/review/${id}/`);
        setCampaignReview(response.data);

      } catch (error) {
        console.log(error)
      }
    };
    axiosCampaignReview();
  }, [id]);

  const getImageUrl = (imagePath) => {
    return `${process.env.REACT_APP_BACKEND_URL}${imagePath}`;
  };

  const onErrorImg = (e) => {
    e.target.src = campaign_default_image
  }

  // 댓글 POST
  const token = localStorage.getItem('access')
  const axiosCommentCreate = async (e) => {
    e.preventDefault();

    if (token) {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/campaigns/comment/${id}/`, {
          'content': createComment,
        }, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        console.log(response)
        alert("댓글 작성 성공!");
        // 작성 후 바로 댓글 재렌더링시키기
        axiosCampaignComment();
      } catch (error) {
        console.log(error)
        alert("댓글 작성에 실패했습니다.");
      }
    } else {
      alert("로그인이 필요합니다.")
    }

  };

  const handleCommentCreate = (event) => {
    setCreateComment(event.target.value);
  };

  // Fund Modal
  const [fundModalOpen, setFundModalOpen] = useState(false);

  const openFundModal = () => {
    setFundModalOpen(true);
  };
  const closeFundModal = () => {
    setFundModalOpen(false);
  };
  // Share Modal
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const openShareModal = () => {
    setShareModalOpen(true);
  };
  const closeShareModal = () => {
    setShareModalOpen(false);
  };
  // Review Modal
  const [reviewModalOpen, setReviewModalOpen] = useState([]);

  const openReviewModal = (index) => {
    setReviewModalOpen((prevState) => {
      const newState = [...prevState];
      newState[index] = true;
      return newState;
    });
  };
  const closeReviewModal = (event, index) => {
    event.stopPropagation();
    setReviewModalOpen((prevState) => {
      const newState = [...prevState];
      newState[index] = false;
      return newState;
    });
  };

  // 좋아요
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // 좋아요 빨갛게 하는 함수
  const handleLikeButton = () => {
    if (token) {
      setIsLiked(!isLiked);
    } else {
      alert("로그인이 필요합니다.")
    };
  };
  // 좋아요 누른상태인지 상태확인 get함수
  const axiosCampaignLikeStatus = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/campaigns/${id}/like/`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      setIsLiked(response.data.is_liked);
    } catch (error) {
      console.log(error)
    }
  };
  useEffect(() => {
    axiosCampaignLikeStatus();
    // eslint-disable-next-line
  }, []);

  // 좋아요 axios
  const axiosLike = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/campaigns/${id}/like/`, {}, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      setIsLiked(response.data.is_liked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      console.log(error)
    }
  };
  // 캠페인 참여
  const [isParticipated, setIsParticipated] = useState(false);

  // 캠페인 참여정보 초기값 GET
  const axiosParticipateStatus = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/campaigns/${id}/participation/`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      setIsParticipated(response.data.is_participated);
    } catch (error) {
      console.log(error)
    }
  };
  useEffect(() => {
    axiosParticipateStatus();
    // eslint-disable-next-line
  }, []);
  // 캠페인 참여 axios
  const axiosParticipate = async () => {
    if (token) {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/campaigns/${id}/participation/`, {}, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        setIsParticipated(response.data.is_participated);
        isParticipated ? (alert("캠페인 참여가 취소되었습니다.")) : (alert("캠페인 참여 성공!"))
      } catch (error) {
        console.log(error)
        alert("캠페인 참여에 실패했습니다.")
      }
    } else {
      alert("로그인이 필요합니다.")
    };
  }


  // Share url
  const currentUrl = window.location.href;

  // 마감임박 Boolean
  const isAboutToClose = (endDate) => {
    const today = new Date().getDate();
    const endFormatting = endDate.replace(/년|월|일/g, '-');
    const end = new Date(endFormatting).getDate();

    const differenceInDays = end - today
    return differenceInDays >= 0 && differenceInDays <= 3;
  };


  return (
    <div className="campaignContainer">
      {campaign ? (
        <>
          <h1>{campaign.title}</h1>
          <div className="campaignContentDiv">
            <div className={isAboutToClose(campaign.campaign_end_date) ? "closeBadgeDetail" : "campaignImageDiv"}>
              <img className="campaignImage" src={getImageUrl(campaign.image)} alt="campaign_image" onError={onErrorImg} />
            </div>
            <div className="campaignContentRight">
              <div className="campaignStatus">{campaign.status}</div>
              <div className="marginBottom10">{campaign.content}</div>
              <div className="marginBottom10">주최 : {campaign.user}</div>
              <div className="marginBottom10">모집 인원 : {campaign.participant_count} / {campaign.members}</div>
              <div className="marginBottom10">신청 시작일 : {campaign.campaign_start_date.substr(0, 13)}</div>
              <div className="marginBottom10">신청 마감일 : {campaign.campaign_end_date.substr(0, 13)}</div>
              {campaign.activity_start_date && campaign.activity_end_date ? (
                <div className="marginBottom10">활동 예정일 : {campaign.activity_start_date.substr(0, 13)} ~ {campaign.activity_end_date.substr(0, 13)}</div>
              ) : (
                <div className="marginBottom10">활동이 없는 캠페인입니다.</div>
              )}
              {campaign.fundings && campaign.fundings.goal !== 0 ? (
                <div className="campaignFund">
                  <div className="campaignFundPercent">{Math.floor(campaign.fundings.current / campaign.fundings.goal)}% 달성</div>
                  <span className="campaignFundcurrent"> ({campaign.fundings.current.toLocaleString()}원)</span>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ color: 'white', marginLeft: '25px', }}
                    disabled={campaign.status.includes("종료") || campaign.status.includes("실패")}
                    onClick={openFundModal}
                  >펀딩 참여하기
                  </Button>
                  <Modal open={fundModalOpen} close={closeFundModal} header="펀딩 감사합니다!">
                    {/* Modal.js <main> {props.children} </main>에 내용이 입력된다. 리액트 함수형 모달 */}
                    <div className="modalMent">펀딩 금액을 입력해주세요.</div>
                    <FormControl sx={{ width: '100%', }}>
                      <InputLabel htmlFor="outlined-adornment-amount">금액</InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-amount"
                        startAdornment={<InputAdornment position="start">￦</InputAdornment>}
                        label="금액"
                        inputProps={{ min: 0 }}
                      // value={}
                      // onChange={}
                      />
                    </FormControl>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        color: 'white',
                        marginTop: '20px',
                        marginLeft: '385px',
                      }}
                    // onClick={}
                    >
                      펀딩하기
                    </Button>
                  </Modal>
                </div>
              ) : (
                <div className="marginBottom10">펀딩을 진행하지 않는 캠페인입니다.</div>
              )}
              <div className="campaignContentBtn">
                <Button
                  variant={isLiked ? 'contained' : 'outlined'}
                  color={isLiked ? 'danger' : 'gray'}
                  sx={{
                    width: '75px',
                    height: '50px',
                    fontSize: '1.3rem',
                    color: isLiked ? 'white' : 'red',
                    marginRight: '30px',
                  }}
                  disabled={campaign.status.includes("종료") || campaign.status.includes("실패")}
                  onClick={() => {
                    handleLikeButton();
                    axiosLike();
                  }}
                >
                  ❤ {likeCount}
                </Button>
                <Button
                  variant="outlined"
                  color="gray"
                  sx={{
                    height: '50px',
                    fontSize: '1.2rem',
                    color: 'gray',
                    marginRight: '30px',
                  }}
                  disabled={campaign.status.includes("종료") || campaign.status.includes("실패")}
                  onClick={openShareModal}
                >
                  <ShareIcon />
                </Button>
                <Modal open={shareModalOpen} close={closeShareModal} header="공유하기">
                  <div className="modalMent">캠페인을 공유해보세요.(kakao미구현)</div>
                  <div className='shareBtnContainer'>
                    <CopyToClipboard text={currentUrl}>
                      <button
                        className="shareUrlBtn"
                        onClick={() => alert("복사 완료!")}>
                        URL
                      </button>
                    </CopyToClipboard>
                    <FacebookShareButton url={currentUrl} className="shareBtn">
                      <FacebookIcon size={48} round={true} borderRadius={24}></FacebookIcon>
                    </FacebookShareButton>
                    <TwitterShareButton url={currentUrl} className="shareBtn">
                      <TwitterIcon size={48} round={true} borderRadius={24}></TwitterIcon>
                    </TwitterShareButton>
                    <button
                      className="shareKakaoBtn"
                      style={{
                        padding: '0',
                        backgroundColor: 'transparent'
                      }}>
                      <img
                        src={sharekakao}
                        alt="kakaoShareButton"
                        className="shareKakaoBtn" />
                    </button>
                  </div>

                </Modal>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    width: '250px',
                    height: '50px',
                    fontSize: '1.3rem',
                    color: 'white',
                  }}
                  disabled={campaign.status.includes("종료") || campaign.status.includes("실패")}
                  onClick={axiosParticipate}
                >
                  캠페인 참여하기
                </Button>
              </div>
            </div>

          </div>
        </>
      ) : (
        <div className="campaignNothing">
          <h2>캠페인을 불러오지 못했습니다.</h2>
        </div>
      )
      }
      <div className="campaignBottom">
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="primary"
            indicatorColor="primary"
            centered
            sx={{
              '& .MuiTab-root': {
                fontSize: '1.5rem'
              },
            }}
          >
            <Tab label="캠페인 댓글" {...a11yProps(0)} />
            <Tab label="캠페인 후기" {...a11yProps(1)} />
            <Tab label="캠페인 정보 제공 고시" {...a11yProps(2)} />
          </Tabs>
          <TabPanel value={value} index={0}>
            {campaignComments.length > 0 ? (
              campaignComments.map((campaignComment) => (
                <div className="campaignCommentDiv" key={campaignComment.id}>
                  <div className="campaignCommentUser">
                    {campaignComment.user}
                  </div>
                  <div className="campaignCommentContent">
                    {campaignComment.content}
                  </div>
                  <div className="campaignCommentCreatedAt">
                    {campaignComment.created_at}
                  </div>
                  <hr />
                </div>
              ))
            ) : (
              <div className="campaignNothing">
                <h2>작성된 댓글이 없습니다.</h2>
              </div>
            )}
            <TextField
              id="filled-multiline-flexible"
              label="댓글을 작성해주세요."
              multiline
              maxRows={3}
              variant="filled"
              sx={{
                width: '70%',
                marginRight: '20px',
              }}
              value={createComment}
              onChange={handleCommentCreate}
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              sx={{
                color: 'white',
                fontSize: '0.8rem',
                marginTop: '10px',
              }}
              onClick={axiosCommentCreate}
            >
              작성하기
            </Button>
          </TabPanel>
          <TabPanel value={value} index={1}>
            {campaignReviews.length > 0 ? (
              campaignReviews.map((campaignReview, index) => (
                <div
                  className="campaignCommentDiv"
                  key={campaignReview.id}
                  onClick={() => openReviewModal(index)}
                >
                  <h2>
                    {campaignReview.title}
                  </h2>
                  <div className="campaignCommentContent">
                    {campaignReview.user}
                  </div>
                  <div className="campaignCommentCreatedAt">
                    {campaignReview.created_at}
                  </div>
                  <hr />

                  <Modal open={reviewModalOpen[index] || false} close={(event) => closeReviewModal(event, index)} header="캠페인 후기">
                    <h2>
                      {campaignReview.title}
                    </h2>
                    <img className="campaignImage" src={getImageUrl(campaignReview.image)} alt="review_image" onError={onErrorImg} />
                    <div className="campaignCommentContent">
                      {campaignReview.user}
                    </div>
                    <div className="campaignCommentContent">
                      {campaignReview.content}
                    </div>
                    <div className="campaignCommentCreatedAt">
                      {campaignReview.created_at}
                    </div>
                  </Modal>
                </div>
              ))
            ) : (
              <div className="campaignNothing">
                <h2>작성된 후기가 없습니다.</h2>
              </div>
            )}
          </TabPanel>
          <TabPanel value={value} index={2}>
            <InfoAnnounceMap text={infoAnnounce} />
          </TabPanel>
        </Box>
      </div>
    </div >
  );
};

export { CampaignDetail };