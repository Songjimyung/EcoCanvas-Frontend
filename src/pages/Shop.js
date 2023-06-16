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
  const [currentPage, setCurrentPage] = useState(1);
  const productPerPage = 6;


  const handleCategorySelect = (event) => {
    const selectedCategoryId = event.target.value;
    setCategoryId(selectedCategoryId);
  };
  const getImageUrl = (imagePath) => {
    return `http://localhost:8000${imagePath}`;
  };
  const onErrorImg = (e) => {
    e.target.src = product_default_img;
  };
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    const fetchProductList = async () => {
      try {
        if (categoryId) { // categoryId 값이 존재할 때에만 API 요청 보내도록 수정
          const response = await axios.get(`http://localhost:8000/shop/products/list/${categoryId}`);
          setProductList(response.data);
          console.log(response.data)
        } else { // categoryId 값이 존재하지 않을 경우 최신 상품 목록이 보여지도록 수정 
          const defaultResponse = await axios.get('http://localhost:8000/shop/products/list/recent/');
          setProductList(defaultResponse.data);
          console.log(defaultResponse.data)
        }
      } catch (error) {
        console.error('Error fetching product list:', error);
      }
    };
    fetchProductList();
  }, [categoryId]);

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const response = await axios.get('http://localhost:8000/shop/categorys/list/');
        setCategoryList(response.data);
      } catch (error) {
        console.error('Error fetching category list:', error);
      }
    };
    fetchCategoryList();
  }, []);
  const indexOfLastProduct = currentPage * productPerPage;
  // 현재페이지의 첫 인덱스 (현재 페이지의 마지막 인덱스 - 한 페이지당 6개의 캠페인)
  const indexOfFirstProduct = indexOfLastProduct - productPerPage;
  // 캠페인 개수를 currentPage의 첫 인덱스부터, 끝 인덱스까지 (2페이지면 7~12)
  const currentProduct = productList.slice(indexOfFirstProduct, indexOfLastProduct);

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
          <select className="category-dropdown">
            <option value="">정렬</option>
            <option value="category1">최신순</option>
            <option value="category2">조회순</option>
            <option value="category3">가격높은순</option>
            <option value="category4">가격낮은순</option>
            <option value="category3">구매순</option>
          </select>
        </nav>
      </header>
      <main>
        <div className="productCardContainer">
          {currentProduct.map((product) => (
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
            count={Math.ceil(productList.length / productPerPage)}
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