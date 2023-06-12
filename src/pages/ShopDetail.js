import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from "axios";
import '../css/product.css'

const ShopDetail = () => {
  let { productId } = useParams();
  const [product, setProduct] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/shop/products/${productId}/`);
        console.log(response.data);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [productId]);

  return (
    <div className="product-detail-wrap">
      {product ? (
        <>
          <h1>{product.product_name}</h1>
          <div className='product-detail'>
            {product.images && product.images.length > 0 && (
              <img src={`http://localhost:8000${product.images[0]['image_file']}`} alt={product.name} />
            )}
            <div className='product-detail-info'>
              <p>상품명: {product.product_name}</p>
              <p>소개: {product.product_desc}</p>
              <p>Price: {product && product.product_price ? `$${product.product_price.toLocaleString()}` : 'N/A'}</p>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export { ShopDetail };