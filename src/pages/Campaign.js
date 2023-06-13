import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/campaign.css';
import campaign_default_image from '../img/campaign_default_image.jpg';

import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import IconButton from '@mui/material/IconButton';
import CampaignIcon from '@mui/icons-material/Campaign';
import { Button, CardActionArea, CardActions } from '@mui/material';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';


const Campaign = () => {
  const [campaignList, setCampaignList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const campaignsPerPage = 6;

  useEffect(() => {
    const axiosCampaignList = async () => {
      try {
        const response = await axios.get('http://localhost:8000/campaigns');
        setCampaignList(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching campaign:', error);
      }
    };

    axiosCampaignList();
  }, []);

  const getImageUrl = (imagePath) => {
    return `http://localhost:8000${imagePath}`;
  };

  const onErrorImg = (e) => {
    e.target.src = campaign_default_image;
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // 현재 페이지의 마지막 인덱스 (현재페이지 (1) * 한 페이지당 6개의 캠페인)
  const indexOfLastCampaign = currentPage * campaignsPerPage;
  // 현재페이지의 첫 인덱스 (현재 페이지의 마지막 인덱스 - 한 페이지당 6개의 캠페인)
  const indexOfFirstCampaign = indexOfLastCampaign - campaignsPerPage;
  // 캠페인 개수를 currentPage의 첫 인덱스부터, 끝 인덱스까지 (2페이지면 7~12)
  const currentCampaigns = campaignList.slice(indexOfFirstCampaign, indexOfLastCampaign);

  return (
    <>
      <h1>캠페인 둘러보기</h1>

      <div className="campaignCardContainer">
        <Grid container justifyContent="flex-end" margin={'0 4% 2% 0'}>
          <Link className="campaignBtn" to={'/campaign/create'}>
            <Button variant="contained" color="primary" startIcon={<CampaignIcon />}>
              캠페인 신청하기
            </Button>
          </Link>
        </Grid>

        {currentCampaigns.map((campaign) => (
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
                  <Typography variant="body2" color="text.secondary">
                    {campaign.campaign_start_date.substr(0, 13)} ~ {campaign.campaign_end_date.substr(0, 13)} <br />
                    달성률(%) 모금금액
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Link>

            <CardActions disableSpacing>
              <IconButton aria-label="add to favorites">
                <FavoriteIcon />
              </IconButton>
              <IconButton aria-label="share">
                <ShareIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </div>

      <span className="campaignBadge">7일 남음</span>
      <span className="campaignDangerBadge">마감임박</span>

      <Grid container justifyContent="center">
        <Pagination
          count={Math.ceil(campaignList.length / campaignsPerPage)}
          page={currentPage}
          color="primary"
          onChange={handlePageChange}
        />
      </Grid>
    </>
  );
};

export { Campaign };