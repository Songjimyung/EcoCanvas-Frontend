import React, { useState, useEffect } from 'react';
import '../css/product.css'
import { Link } from 'react-router-dom';
import axios from 'axios';

const Shop = () => {
  const [productList, setProductList] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [selectedCategoryProducts, setSelectedCategoryProducts] = useState([]);

  const handleCategorySelect = (event) => {
    const selectedCategoryId = event.target.value;
    setCategoryId(selectedCategoryId);
  };

  useEffect(() => {
    // 백엔드 API에서 상품 목록을 가져오는 함수
    const fetchProductList = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/shop/products/list/${categoryId}`);
        setProductList(response.data); // 받아온 데이터를 상품 목록에 설정
        console.log(productList); // 데이터를 받아온 후의 productList 출력
      } catch (error) {
        console.error('Error fetching product list:', error);
      }
    };
    fetchProductList(); // 상품 목록을 가져오는 함수 호출
  }, [categoryId]);

  useEffect(() => {
    // 선택된 카테고리에 대한 상품 목록을 필터링하여 업데이트합니다.
    const filteredProducts = productList.filter(product => product.category === categoryId);
    setSelectedCategoryProducts(filteredProducts);
  }, [productList, categoryId]);

  return (
    <div>
      <header>
        <nav>
          <select className="category-dropdown" onChange={handleCategorySelect}>
            <option value="">카테고리 선택</option>
            <option value="1">카테고리 1</option>
            <option value="2">카테고리 2</option>
            <option value="3">카테고리 3</option>
            <option value="4">카테고리 4</option>
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
                  <Link to={`/products/${product.id}`}>
                    <img src={product.image} alt={product.name} />
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
                  <Link to={`/products/${product.id}`}>
                    <img src={product.image} alt={product.name} />
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