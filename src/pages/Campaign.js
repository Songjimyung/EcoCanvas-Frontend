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

  // Campaign GET
  const axiosCampaignList = async (currentPage) => {
    try {
      const response = await axios.get(`http://localhost:8000/campaigns/?page=${currentPage}`);
      setCampaignList(response.data.results);
      setCampaignCount(response.data.count);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching campaign:', error);
    }
  };

  useEffect(() => {
    axiosCampaignList(currentPage);
  }, [currentPage]);

  const getImageUrl = (imagePath) => {
    return `http://localhost:8000${imagePath}`;
  };

  const onErrorImg = (e) => {
    e.target.src = campaign_default_image;
  };

  // pagination
  const navigate = useNavigate();

  const handlePageChange = (event, page) => {
    const pageNumber = parseInt(page);
    setCurrentPage(pageNumber);
    navigate(`/campaign?page=${pageNumber}`);
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
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const openShareModal = () => {
    setShareModalOpen(true);
  };
  const closeShareModal = () => {
    setShareModalOpen(false);
  };
  // Share url
  const currentUrl = window.location.href;
  const generateCampaignUrl = (campaignId) => {
    return `${currentUrl}/${campaignId}`;
  };


  return (
    <div className="campaignContainer">
      <h1>캠페인 둘러보기</h1>

      <div className="campaignCardContainer">
        <Grid container justifyContent="flex-end" marginBottom={'2%'}>
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

        {campaignList.map((campaign) => (
          <Card sx={{ maxWidth: 450 }} key={campaign.id} className="campaignCard">
            <Link to={`/campaign/${campaign.id}`}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="250"
                  image={getImageUrl(campaign.image)}
                  alt="campaign_image"
                  onError={onErrorImg}
                />
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
                    {campaign.fundings && campaign.fundings.goal !== 0 ? (
                      <>{Math.floor(campaign.fundings.current / campaign.fundings.goal)}% 달성<br /></>
                    ) : (
                      <div>펀딩이 없는 캠페인입니다.</div>
                    )}
                    인원 : {campaign.participant.length} / {campaign.members}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Link>

            <CardActions disableSpacing>
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
                onClick={openShareModal}>
                <ShareIcon />
              </IconButton>
              <Modal open={shareModalOpen} close={closeShareModal} header="공유하기">
                <div className="modalMent">캠페인을 공유해보세요.(kakao미구현, 모달 여섯개씩 켜지고있는 것 같음. 항상 끝자리 캠페인으로 Share)</div>
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
            </CardActions>
          </Card>
        ))}
      </div >

      <span className="campaignBadge">7일 남음</span>
      <span className="campaignDangerBadge">마감임박</span>

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