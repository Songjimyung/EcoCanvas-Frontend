import React, { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import '../css/product.css'
import { Card, Grid, Typography, Button, IconButton, CircularProgress } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';


const ShopDetail = () => {
  let { productId } = useParams();
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/shop/products/${productId}/`);
        console.log(response.data);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

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
              {product.images && product.images.length > 0 && (
                <img src={`http://localhost:8000${product.images[0]['image_file']}`} alt={product.name} style={{ height: '100%', objectFit: 'cover', marginTop: '20px' }} />
              )}
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
                  {product && product.product_price ? `${product.product_price.toLocaleString()}원` : 'N/A'}
                </Typography>
                <Link to={`/product/buy/${product.id}`}>
                  <Button variant="contained" className='buyBtn'>구매하기</Button>
                </Link>
                <IconButton>
                  <ShoppingCart />
                </IconButton>
              </div>
            </Grid>
          </Grid>
        )}
      </Card>
    </div>
  );
};

export { ShopDetail };