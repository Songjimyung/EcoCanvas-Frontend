import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/campaign.css';
import campaign_default_image from '../img/campaign_default_image.jpg';
import ImageHeader from '../components/imageheader/ImageHeader';
import campaign_family from '../img/campaign_family.jpg'
import Share from '../components/share/Share';

// mui
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



const Campaign = () => {
  const token = localStorage.getItem('access')

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
      let url = `${process.env.REACT_APP_BACKEND_URL}/campaigns/?page=${currentPage}&order=${order}`
      if (end) {
        url += `&end=${end}`;
      }
      const response = await axios.get(url);
      setCampaignList(response.data.results);
      setCampaignCount(response.data.count);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    axiosCampaignList(currentPage, end, order);
  }, [currentPage, end, order]);

  // 이미지처리
  const getImageUrl = (imagePath) => {
    if (process.env.NODE_ENV === 'development') {
      return `${process.env.REACT_APP_BACKEND_URL}${imagePath}`;
    }
    return `${imagePath}`;
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

  // 좋아요 버튼
  const handleLikeButton = (campaignId) => {
    if (token) {
      setIsLiked(!isLiked);
      axiosLike(campaignId);
    } else {
      alert("로그인이 필요합니다.")
    }
  };

  // 좋아요 axios
  const axiosLike = async (campaignId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/campaigns/${campaignId}/like/`, {}, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      setIsLiked(response.data.is_liked);
    } catch (e) {
      console.error(e);
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

  // 마감임박 Boolean
  const isAboutToClose = (endDate) => {
    const today = new Date().getDate();
    const endFormatting = endDate.replace(/년|월|일/g, '-');
    const end = new Date(endFormatting).getDate();

    const differenceInDays = end - today
    return differenceInDays >= 0 && differenceInDays <= 3;
  };

  // 캠페인 신청 token check
  const handleCampaignLinkClick = () => {
    if (token) {
      navigate(`/campaign/create`);
    } else {
      alert("로그인이 필요합니다.");
    }
  };


  return (
    <div className="campaignContainer">
      <ImageHeader
        h1Text="캠페인 둘러보기"
        pText="EcoCanvas Campaigns"
        imageUrl={campaign_family}
      />

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
                <option value="popular">인기순</option>
                <option value="like">좋아요순</option>
                <option value="amount">모금금액순</option>
              </select>
            </nav>
          </header>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CampaignIcon />}
            onClick={handleCampaignLinkClick}
            sx={{
              height: '50px',
              fontSize: '1.3rem',
              color: 'white',
            }}>
            캠페인 신청하기
          </Button>
        </Grid>

        {campaignList.map((campaign, index) => (
          <Card sx={{ maxWidth: 500 }} key={campaign.id} className="campaignCard">
            <Link to={`/campaign/${campaign.id}`}>
              <CardActionArea>
                <div className={isAboutToClose(campaign.campaign_end_date) ? "closeBadge" : ""}>
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
                    참여인원 : {campaign.participant_count} / {campaign.members}<br />
                    {campaign.fundings && campaign.fundings.goal !== 0 ? (
                      <><span className="campaignCardPercent">{Math.floor(campaign.fundings.amount / campaign.fundings.goal)}%</span> 달성</>
                    ) : (
                      <div>펀딩을 진행하지 않는 캠페인입니다.</div>
                    )}
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
                  <Share id={campaign.id} />
                </Modal>
              </div>
            </CardActions>
          </Card>
        ))}
      </div >

      <Grid container justifyContent="center" sx={{ marginBottom: "30px" }}>
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