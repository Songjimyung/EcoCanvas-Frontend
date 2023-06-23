import React, { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import '../css/product.css'
import { Card, Grid, Typography, Button, IconButton, CircularProgress, Snackbar } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import product_default_img from '../img/sample_product.png';
import NotificationAddRoundedIcon from '@mui/icons-material/NotificationAddRounded';

const ShopDetail = () => {
  let { productId } = useParams();
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockAlertOpen, setStockAlertOpen] = useState(false);

  useEffect(() => {
    // 재고 알람 체크
    if (product.product_stock && product.product_stock < 10 && product.product_stock > 0) {
      setStockAlertOpen(true);
    }
  }, [product]);



  const handleFormSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');

    fetch(`${process.env.REACT_APP_BACKEND_URL}/shop/products/restock/${productId}/`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((data) => {
            const errorValues = Object.values(data);
            throw new Error(errorValues.join('\n'));
          });
        }
      })
      .then((result) => {
        
        
        window.location.reload();
      })
      .catch((error) => {
        
        alert(error.message);
      });
  };


  const handleStockAlertClose = () => {
    setStockAlertOpen(false);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {

        const token = localStorage.getItem('access');
        const headers = {
          Authorization: `Bearer ${token}`,
        };


        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/shop/products/${productId}/`,
          { headers }
        );
        if (response.status === 200) {
          
          setProduct(response.data);
          setLoading(false);
        }
      } catch (error) {
        
        setLoading(false);
      }

    };
    fetchProduct();
  }, [productId]);

  const getImageUrl = (imagePath) => {
    if (process.env.NODE_ENV === 'development') {
      return `${process.env.REACT_APP_BACKEND_URL}${imagePath}`;
    }
    return `${imagePath}`;
  };

  return (
    <div className="product-detail-wrap" >
      <Card style={{ height: '800px' }}>
        {loading ? (
          <Grid container alignItems="center" justifyContent="center" style={{ height: '100%' }}>
            <CircularProgress />
          </Grid>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <img
                src={product.images && product.images.length > 0 ? getImageUrl(product.images[0]['image_file']) : product_default_img}
                alt={product.name}
                style={{ height: '100%', objectFit: 'cover', marginTop: '20px' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="product-detail-info">
                <Typography variant="h5" gutterBottom>
                  {product.product_name}
                </Typography>
                <Typography variant="subtitle1" style={{ fontSize: '12px', marginBottom: '50px' }}>
                  조회수 {product.hits}
                </Typography>
                <Typography variant="body1" paragraph>
                  {product.product_desc}
                </Typography>
                <Typography variant="body1" paragraph>
                  재고: {product.sold_out ? '매진' : product.product_stock}
                </Typography>
                <Typography variant="body1" paragraph>
                  {product && product.product_price ? `${product.product_price.toLocaleString()}원` : 'N/A'}
                </Typography>
                {product.sold_out ? (
                  <Typography variant="body1" paragraph style={{ color: 'red' }}>
                    품절되었습니다.
                  </Typography>
                ) : (
                  <>
                    <Link to={`/product/buy/${product.id}`}>
                      <Button variant="contained" className='buyBtn'>구매하기</Button>
                    </Link>
                    <IconButton>
                      <ShoppingCart />
                    </IconButton>
                  </>
                )}
                {product.sold_out && (
                  <Button variant="contained" className='buyBtn' onClick={handleFormSubmit}>
                    재입고 알림신청
                    <IconButton>
                      <NotificationAddRoundedIcon />
                    </IconButton></Button>
                )}


              </div>
            </Grid>
          </Grid>
        )}
      </Card>
      <Snackbar
        open={stockAlertOpen}
        autoHideDuration={3000}
        onClose={handleStockAlertClose}
        message="재고가 얼마남지 않았어요!"
      />
    </div>
  );
};

export { ShopDetail };