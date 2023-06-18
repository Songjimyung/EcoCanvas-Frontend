import React, { useState, useEffect } from 'react';
import '../css/product.css'
import { Link } from 'react-router-dom';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { CardActionArea, CardActions } from '@mui/material';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import product_default_img from '../img/sample_product.png';


const Shop = () => {
  const [productList, setProductList] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleCategorySelect = (event) => {
    const selectedCategoryId = event.target.value;
    setCategoryId(selectedCategoryId);
  };

  const handleSortBySelect = (event) => {
    const selectedSortBy = event.target.value;
    setSortBy(selectedSortBy);
  };

  const getImageUrl = (imagePath) => {
    return `http://localhost:8000${imagePath}`;
  };

  const onErrorImg = (e) => {
    e.target.src = product_default_img;
  };

  const handlePageChange = async (event, page) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    const fetchProductList = async () => {
      try {
        let url = 'http://localhost:8000/shop/products/list/';

        if (categoryId) { // 카테고리 선택시 동적으로 요청하도록
          url += `${categoryId}/`;
        }
        if (sortBy === 'hits') {
          url += '?sort_by=hits';
        } else if (sortBy === 'latest') {
          url += '?sort_by=latest';
        } else if (sortBy === 'highprice') {
          url += '?sort_by=high_price';
        } else if (sortBy === 'lowprice') {
          url += '?sort_by=low_price';
        }

        url += `&page=${currentPage}`;

        const response = await axios.get(url);
        setProductList(response.data.results);
        const totalPages = Math.ceil(response.data.count / 6);
        setTotalPages(totalPages);
        console.log(response.data)
      } catch (error) {
        console.error('상품 목록을 불러오는 중 오류가 발생했습니다:', error);
      }
    };

    const fetchCategoryList = async () => {
      try {
        const response = await axios.get('http://localhost:8000/shop/categorys/list/');
        setCategoryList(response.data);
      } catch (error) {
        console.error('상품 목록을 불러오는 중 오류가 발생했습니다:', error);
      }
    };
    fetchProductList();
    fetchCategoryList();
  }, [categoryId, sortBy, currentPage]);

  return (
    <div>
      <header>
        <nav>
          <select className="category-dropdown" onChange={handleCategorySelect}>
            <option value="">카테고리 선택</option>
            {categoryList.map(category => (
              <option key={category.id} value={category.id}>
                {category.category_name}
              </option>
            ))}
          </select>
          <select className="category-dropdown" onChange={handleSortBySelect}>
            <option value="latest">최신순</option>
            <option value="hits">조회순</option>
            <option value="highprice">가격높은순</option>
            <option value="lowprice">가격낮은순</option>
            <option value="purchases">구매순</option>
          </select>
        </nav>
      </header>
      <main>
        <div className="productCardContainer">
          {productList.map((product) => (
            <Card sx={{ maxWidth: 450 }} key={product.id} className="productCard">
              <Link to={`/product/${product.id}`}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="250"
                    image={product.images && product.images.length > 0 ? getImageUrl(product.images[0]['image_file']) : product_default_img}
                    alt="product_image"
                    onError={onErrorImg}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {product.product_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product && product.product_price ? `${product.product_price.toLocaleString()}원` : 'N/A'}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Link>
              <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                  <FavoriteIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </div >
        <Grid container justifyContent="center">
          <Pagination
            count={totalPages}
            page={currentPage}
            color="primary"
            onChange={handlePageChange}
          />
        </Grid>
      </main>
    </div>
  );
};

export { Shop };