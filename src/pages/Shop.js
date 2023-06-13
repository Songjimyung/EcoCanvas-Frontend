import React, { useState, useEffect } from 'react';
import '../css/product.css'
import { Link } from 'react-router-dom';
import axios from 'axios';

const Shop = () => {
  const [productList, setProductList] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [categoryList, setCategoryList] = useState([]);

  const handleCategorySelect = (event) => {
    const selectedCategoryId = event.target.value;
    setCategoryId(selectedCategoryId);
  };

  useEffect(() => {
    const fetchProductList = async () => {
      try {
        if (categoryId) { // categoryId 값이 존재할 때에만 API 요청 보내도록 수정
          const response = await axios.get(`http://localhost:8000/shop/products/list/${categoryId}`);
          setProductList(response.data);
          console.log(response.data)
        } else {
          setProductList([]); // categoryId가 비어있을 경우 productList를 빈 배열로 초기화
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
        <section>
          <h2>인기 상품</h2>
          {productList.length === 0 ? (
            <p>상품이 없습니다.</p>
          ) : (
            <ul className="product-list">
              {productList.map(product => (
                <li key={product.id}>
                  <Link to={`/product/${product.id}`}>
                    <img src={`http://localhost:8000${product.images[0]['image_file']}`} alt={product.name} />
                  </Link>
                  <h3>{product.product_name}</h3>
                  <p>{product.product_desc}</p>
                  <p>{product.product_price}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <h2>{categoryId ? `${categoryId} 상품` : '카테고리를 선택하세요'}</h2>
          {productList.length === 0 ? (
            <p>상품이 없습니다.</p>
          ) : (
            <ul className="product-list">
              {productList.map(product => (
                <li key={product.id}>
                  <Link to={`/product/${product.id}`}>
                    <img src={`http://localhost:8000${product.images[0]['image_file']}`} alt={product.name} />
                  </Link>
                  <h3>{product.product_name}</h3>
                  <p>{product.product_desc}</p>
                  <p>{product.product_price}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export { Shop };