import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/campaign.css"
import campaign_default_image from "../img/campaign_default_image.jpg"
import CommentForm from "../campaign/CommentForm";
import SelectCard from "../selectcard/selectcard";

// MUI
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import ShareIcon from '@mui/icons-material/Share';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import EditMenu from "../components/editmenu/EditMenu";
import Share from "../components/share/Share";

// modal
import Modal from "../components/modal/Modal"



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

  // token
  const token = localStorage.getItem('access');
  const payload = localStorage.getItem('payload');
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    if (payload) {
      const payloadObject = JSON.parse(payload);
      setUserId(payloadObject['user_id']);
    }
  }, [payload]);

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
    } catch (e) {
      console.error(e);
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
    } catch (e) {
      console.error(e);
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
      } catch (e) {
        console.error(e);
      }
    };
    axiosCampaignReview();
  }, [id]);

  // 이미지처리
  const getImageUrl = (imagePath) => {
    if (process.env.NODE_ENV === 'development') {
      return `${process.env.REACT_APP_BACKEND_URL}${imagePath}`;
    }
    return `${imagePath}`;
  };

  const onErrorImg = (e) => {
    e.target.src = campaign_default_image
  }

  // 댓글 POST
  // eslint-disable-next-line
  const [createComment, setCreateComment] = useState('');

  const axiosCommentCreate = async (createComment) => {
    if (token) {
      try {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/campaigns/comment/${id}/`, {
          'content': createComment,
        }, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        axiosCampaignComment();
      } catch (e) {
        console.error(e);
        alert("댓글 작성에 실패했습니다.");
      }
    } else {
      alert("로그인이 필요합니다.")
    }
  };
  const handleCreateSubmit = (createComment) => {
    setCreateComment(createComment);
    axiosCommentCreate(createComment);
  };

  // Fund Modal
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);

  const openFundModal = () => {
    setFundModalOpen(true);
  };
  const closeFundModal = () => {
    setFundModalOpen(false);
  };

  const handleAmountSubmit = (event) => {
    const value = event.target.value;
    const numericValue = Number(value.replace(/[^0-9.-]+/g, ''));
    setAmount(numericValue);
  };

  const handleFundSubmit = async () => {

    const requestData = {
      amount: amount,
      campaign: id,
      selected_card: selectedCard.cardId
    };
    try {
      await axios.post(`http://localhost:8000/payments/schedule/`, requestData,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
      alert("후원 감사합니다!")
      setFundModalOpen(false)
    } catch (e) {
      console.error(e);
      alert("후원 실패")
    }
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
  useEffect(() => {
    const axiosCampaignLikeStatus = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/campaigns/${id}/like/`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        setIsLiked(response.data.is_liked);
      } catch (e) {
        console.error(e);
      }
    };
    axiosCampaignLikeStatus();
  }, [id, token]);

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
    } catch (e) {
      console.error(e);
    }
  };
  // 캠페인 참여
  const [isParticipated, setIsParticipated] = useState(false);

  // 캠페인 참여정보 초기값 GET
  useEffect(() => {
    const axiosParticipateStatus = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/campaigns/${id}/participation/`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        setIsParticipated(response.data.is_participated);
      } catch (e) {
        console.error(e)
      }
    };
    axiosParticipateStatus();
  }, [id, token]);
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
        axiosCampaignDetail();
      } catch (e) {
        console.error(e);
        alert("캠페인 참여에 실패했습니다.")
      }
    } else {
      alert("로그인이 필요합니다.")
    };
  }

  // 마감임박 Boolean
  const isAboutToClose = (endDate) => {
    const today = new Date().getDate();
    const endFormatting = endDate.replace(/년|월|일/g, '-');
    const end = new Date(endFormatting).getDate();

    const differenceInDays = end - today
    return differenceInDays >= 0 && differenceInDays <= 3;
  };

  // 캠페인 수정삭제
  const campaignOptions = [
    { id: "update", label: "수정하기" },
  ];
  const navigate = useNavigate();
  const handleCampaignEdit = async (optionId) => {
    if (optionId === "update") {
      navigate(`modify`);
    }
  }

  // 댓글 수정삭제
  const commentOptions = [
    { id: "update", label: "수정하기" },
    { id: "delete", label: "삭제하기" },
  ];
  const axiosCommentDelete = async (commentId) => {
    if (token) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/campaigns/comment/detail/${commentId}/`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        alert("삭제되었습니다.");
        axiosCampaignComment();
      } catch (e) {
        console.error(e)
        alert("댓글 삭제에 실패했습니다.")
      }
    } else {
      alert("로그인이 필요합니다.")
    };
  }
  // eslint-disable-next-line
  const [updateComment, setUpdateComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [commentId, setCommentId] = useState(null);

  const handleUpdateSubmit = (commentId, updateComment) => {
    setUpdateComment(updateComment);
    axiosCommentUpdate(commentId, updateComment);
  };

  const axiosCommentUpdate = async (commentId, updateComment) => {
    if (token) {
      try {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/campaigns/comment/detail/${commentId}/`, {
          'content': updateComment,
        }, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        setIsEditing(false);
        axiosCampaignComment();
        alert("수정되었습니다.");
      } catch (e) {
        console.error(e)
        alert("댓글 수정에 실패했습니다.")
      }
    } else {
      alert("로그인이 필요합니다.")
    };
  }
  const handleCommentEdit = (optionId, commentId) => {
    if (optionId === "update") {
      setIsEditing(true);
      setCommentId(commentId);
    } else if (optionId === "delete") {
      if (window.confirm("정말 삭제하시겠습니까?")) {
        axiosCommentDelete(commentId);
      }
    }
  }

  return (
    <div className="campaignContainer">
      {campaign ? (
        <>
          <h1 style={{ margin: "50px 0 50px 0" }}>{campaign.title}</h1>
          <div className="campaignContentDiv">
            <div className={isAboutToClose(campaign.campaign_end_date) ? "closeBadgeDetail" : "campaignImageDiv"}>
              <img className="campaignImage" src={getImageUrl(campaign.image)} alt="campaign_image" onError={onErrorImg} />
            </div>
            <div className="campaignContentRight">
              <div className="campaignTopSetting">
                <div className="campaignStatus">{campaign.status}</div>
                {userId === campaign.user_id ?
                  <EditMenu options={campaignOptions} onOptionClick={handleCampaignEdit} />
                  : <div></div>
                }
              </div>
              <div className="campaignContent">
                {campaign.content.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </div>
              <hr style={{ marginBottom: "10px" }} />
              <div className="campaignContentBottom">주최 : {campaign.user}</div>
              <div className="campaignContentBottom">참여 인원 : {campaign.participant_count} / {campaign.members}</div>
              <div className="campaignContentBottom">캠페인 신청 시작일 : {campaign.campaign_start_date.substr(0, 13)}</div>
              <div className="campaignContentBottom">캠페인 신청 마감일 : {campaign.campaign_end_date.substr(0, 13)}</div>
              {campaign.activity_start_date && campaign.activity_end_date ? (
                <div className="campaignContentBottom">활동 예정일 : {campaign.activity_start_date.substr(0, 13)} ~ {campaign.activity_end_date.substr(0, 13)}</div>
              ) : (
                <div className="campaignContentBottom">활동이 없는 캠페인입니다.</div>
              )}
              {campaign.fundings && campaign.fundings.goal !== 0 ? (
                <div className="campaignFund">
                  <div className="campaignFundPercent">{Math.floor(campaign.fundings.amount / campaign.fundings.goal)}% 달성</div>
                  <span className="campaignFundcurrent"> ({campaign.fundings.amount.toLocaleString()}원)</span>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ color: 'white', marginLeft: '25px', }}
                    disabled={campaign.status.includes("종료") || campaign.status.includes("실패")}
                    onClick={openFundModal}
                  >펀딩 참여하기
                  </Button>
                  <Modal open={fundModalOpen} close={closeFundModal} header="펀딩 감사합니다!">
                    <SelectCard setSelectedCard={setSelectedCard} />
                    {selectedCard && (
                      <div>
                        <h2>선택한 카드:</h2>
                        <p>{selectedCard.cardNumber}</p>
                      </div>
                    )}
                    {/* Modal.js <main> {props.children} </main>에 내용이 입력된다. 리액트 함수형 모달 */}
                    <div className="modalMent">카드를 선택하고 펀딩 금액을 입력해주세요.</div>
                    <FormControl sx={{ width: '100%', }}>
                      <InputLabel htmlFor="outlined-adornment-amount">금액</InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-amount"
                        startAdornment={<InputAdornment position="start">￦</InputAdornment>}
                        label="금액"
                        inputProps={{ min: 0 }}
                        // useState앞에 값 (100000000)지우고 넣어주세요
                        value={amount.toLocaleString()}
                        onChange={handleAmountSubmit}
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
                      onClick={handleFundSubmit}
                    >
                      펀딩하기
                    </Button>
                  </Modal>
                </div>
              ) : (
                <div className="campaignContentBottom">펀딩을 진행하지 않는 캠페인입니다.</div>
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
                  <Share id={id} />
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
                  {isParticipated ? "캠페인 참여취소" : "캠페인 참여하기"}
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
                    {userId === campaignComment.user_id ?
                      <EditMenu
                        options={commentOptions}
                        onOptionClick={(optionId) => handleCommentEdit(optionId, campaignComment.id)}
                      /> : <div style={{ height: "40px" }}></div>}
                  </div>
                  {isEditing && commentId === campaignComment.id ? (
                    <CommentForm comment={campaignComment.content} onSubmit={(updateComment) => handleUpdateSubmit(campaignComment.id, updateComment)} />
                  ) : <div className="campaignCommentContent">{campaignComment.content}</div>
                  }
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
            <CommentForm onSubmit={(createComment) => handleCreateSubmit(createComment)} />
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
                <p style={{ marginTop: "10px", fontSize: "0.9rem", color: "gray" }}>후기는 캠페인이 끝난 후, 마이페이지에서 작성하실 수 있습니다.</p>
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