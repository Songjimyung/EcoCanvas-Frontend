import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/campaign.css';
import campaign_default_image from '../img/campaign_default_image.jpg';
import sharekakao from "../img/sharekakao.webp"

import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CampaignIcon from '@mui/icons-material/Campaign';
import { Button, CardActionArea, CardActions } from '@mui/material';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';

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


const Campaign = () => {
  const [campaignList, setCampaignList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [campaignCount, setCampaignCount] = useState(0);
  const campaignsPerPage = 6;
  const navigate = useNavigate();

  // Filter and Order with Querystring
  const [end, setEnd] = useState(null);
  const [order, setOrder] = useState("recent");

  const handleEndQuery = (event) => {
    const selectedEnd = event.target.value;
    setEnd(selectedEnd);
    setCurrentPage(1);
    navigate(`?page=${currentPage}${selectedEnd ? `&end=${selectedEnd}` : ''}&order=${order}`);
  };
  const handleOrderQuery = (event) => {
    const selectedOrder = event.target.value;
    setOrder(selectedOrder);
    setCurrentPage(1);
    navigate(`?page=${currentPage}${end ? `&end=${end}` : ''}&order=${selectedOrder}`);
  };

  // Campaign GET
  const axiosCampaignList = async (currentPage, end, order) => {
    try {
      let url = `http://localhost:8000/campaigns/?page=${currentPage}&order=${order}`
      if (end) {
        url += `&end=${end}`;
      }
      const response = await axios.get(url);
      setCampaignList(response.data.results);
      setCampaignCount(response.data.count);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching campaign:', error);
    }
  };
  useEffect(() => {
    axiosCampaignList(currentPage, end, order);
  }, [currentPage, end, order]);

  // 이미지처리
  const getImageUrl = (imagePath) => {
    return `http://localhost:8000${imagePath}`;
  };
  const onErrorImg = (e) => {
    e.target.src = campaign_default_image;
  };

  // pagination
  const handlePageChange = (event, page) => {
    const pageNumber = parseInt(page);
    setCurrentPage(pageNumber);
    navigate(`?page=${pageNumber}${end ? `&end=${end}` : ''}&order=${order}`);
  };

  // 좋아요
  const [isLiked, setIsLiked] = useState(false);

  // 좋아요
  const handleLikeButton = (campaignId) => {
    setIsLiked(!isLiked);
    axiosLike(campaignId);
  };
  // 좋아요 누른상태인지 상태확인 get함수
  const token = localStorage.getItem('access')

  // const axiosCampaignLikeStatus = async (campaignId) => {
  //   try {
  //     const response = await axios.get(`http://localhost:8000/campaigns/${campaignId}/like/`, {
  //       headers: {
  //         "Authorization": `Bearer ${token}`,
  //       },
  //     });
  //     console.log(response)
  //     console.log(response.data.is_liked)
  //     setIsLiked(response.data.is_liked);
  //   } catch (error) {
  //     console.error('좋아요 상태 불러오기 실패:', error);
  //   }
  // };
  // useEffect(() => {
  //   axiosCampaignLikeStatus();
  // }, []);

  // 좋아요 axios
  const axiosLike = async (campaignId) => {
    try {
      const response = await axios.post(`http://localhost:8000/campaigns/${campaignId}/like/`, {}, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      setIsLiked(response.data.is_liked);
      console.log(response)
    } catch (error) {
      console.log(error);
    }
  };

  // Share Modal
  const [shareModalOpen, setShareModalOpen] = useState([]);

  const openShareModal = (index) => {
    setShareModalOpen((prevState) => {
      const newState = [...prevState];
      newState[index] = true;
      return newState;
    });
  };
  const closeShareModal = (event, index) => {
    event.stopPropagation();
    setShareModalOpen((prevState) => {
      const newState = [...prevState];
      newState[index] = false;
      return newState;
    });
  };
  // Share url
  const currentUrl = window.location.href;
  const generateCampaignUrl = (campaignId) => {
    return `${currentUrl}/${campaignId}`;
  };

  // 마감임박 Boolean
  const isAboutToClose = (endDate) => {
    const today = new Date();
    const endFormatting = endDate.replace(/년|월|일/g, '-');
    const end = new Date(endFormatting);

    const differenceInDays = today - end
    return differenceInDays <= 7;
  };


  return (
    <div className="campaignContainer">
      <h1>캠페인 둘러보기</h1>

      <div className="campaignCardContainer">
        <Grid container justifyContent="flex-end" marginBottom={'25px'}>
          <header style={{ marginTop: "10px" }}>
            <nav>
              <select
                className="category-dropdown"
                onChange={handleEndQuery}
              >
                <option value="">모든 캠페인</option>
                <option value="N">진행중인 캠페인</option>
                <option value="Y">종료된 캠페인</option>
              </select>
              <select
                className="category-dropdown"
                onChange={handleOrderQuery}
              >
                <option value="recent">최신순</option>
                <option value="closing">마감임박순</option>
                <option value="count">조회순</option>
                <option value="like">좋아요순</option>
                <option value="amount">모금금액순</option>
              </select>
            </nav>
          </header>
          <Link className="campaignBtn" to={'/campaign/create'}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CampaignIcon />}
              sx={{
                height: '50px',
                fontSize: '1.3rem',
                color: 'white'
              }}>
              캠페인 신청하기
            </Button>
          </Link>
        </Grid>

        {campaignList.map((campaign, index) => (
          <Card sx={{ maxWidth: 450 }} key={campaign.id} className="campaignCard">
            <Link to={`/campaign/${campaign.id}`}>
              <CardActionArea>
                <div
                  className={isAboutToClose(campaign.campaign_end_date) ? "closeBadge" : ""}
                >
                  <CardMedia
                    component="img"
                    height="250"
                    image={getImageUrl(campaign.image)}
                    alt="campaign_image"
                    onError={onErrorImg}
                  />
                </div>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {campaign.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    component={'span'}
                  >
                    {campaign.campaign_start_date.substr(0, 13)} ~ {campaign.campaign_end_date.substr(0, 13)} <br />
                    {Math.floor(campaign.fundings.current / campaign.fundings.goal)}% 달성 <br />
                    인원 : {campaign.participant.length} / {campaign.members}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Link>

            <CardActions disableSpacing>
              <div key={campaign.id}>
                <IconButton
                  aria-label="add to favorites"
                  onClick={() => {
                    handleLikeButton(campaign.id);
                  }}
                >
                  <FavoriteIcon
                    sx={{ color: isLiked ? 'red' : '', }} />
                </IconButton>
                <IconButton
                  aria-label="share"
                  onClick={() => openShareModal(index)}>
                  <ShareIcon />
                </IconButton>
                <Modal open={shareModalOpen[index] || false} close={(event) => closeShareModal(event, index)} header="공유하기">
                  <div className="modalMent">캠페인을 공유해보세요.(kakao미구현, URL이 이상하게잡히는 오류있음)</div>
                  <CopyToClipboard text={generateCampaignUrl(campaign.id)}>
                    <button
                      className="shareUrlBtn"
                      onClick={() => alert("복사 완료!")}>
                      URL
                    </button>
                  </CopyToClipboard>
                  <FacebookShareButton url={generateCampaignUrl(campaign.id)}>
                    <FacebookIcon size={48} round={true} borderRadius={24}></FacebookIcon>
                  </FacebookShareButton>
                  <TwitterShareButton url={generateCampaignUrl(campaign.id)}>
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

                </Modal>
              </div>
            </CardActions>
          </Card>
        ))}
      </div >

      <Grid container justifyContent="center">
        <Pagination
          count={Math.ceil(campaignCount / campaignsPerPage)}
          page={currentPage}
          color="primary"
          onChange={handlePageChange}
        />
      </Grid>
    </div>
  );
};

export { Campaign };