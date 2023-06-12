import React, { useEffect, useState } from "react";
import './createProduct.css'

export default function CreateProduct() {
  const [formData, setFormData] = useState({
    image: "",
    product_name: "",
    product_stock: "",
    product_desc: "",
    category: "",
    product_price: ""
  });
  const [categoryId, setCategoryId] = useState();
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access');

    fetch("http://127.0.0.1:8000/shop/categorys/list/", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => response.json())
      .then(result => {
        console.log(result)
        setCategoryList(result);
      })
  }, []);
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const parsedCategoryId = parseInt(categoryId, 10);
    const token = localStorage.getItem('access');


    const selectedCategory = categoryList.find(category => category.id === parsedCategoryId);
    if (!selectedCategory) {
      console.error('Invalid category');
      return;
    }

    const formData = new FormData();
    formData.append('image', e.target.elements.file.files[0]);
    formData.append('product_name', e.target.elements.product_name.value);
    formData.append('product_price', e.target.elements.product_price.value);
    formData.append('product_stock', e.target.elements.product_stock.value);
    formData.append('product_desc', e.target.elements.product_desc.value);
    formData.append('category', selectedCategory.id);

    fetch(`http://127.0.0.1:8000/shop/products/list/${selectedCategory.id}/`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
      });
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      setCategoryId(value);
    }
    setFormData({ ...formData, [name]: value });
  };
  return (
    <div className="createProduct">
      <form className="addProductForm" onSubmit={handleFormSubmit}>
        <div className="addProductItem">
          <label>상품 이름</label>
          <input type="text" name="product_name" placeholder="상품 이름" onChange={handleInputChange}></input>
        </div>
        <div className="addProductItem">
          <label>상품 가격</label>
          <input type="text" name="product_price" placeholder="상품 가격" onChange={handleInputChange}></input>
        </div>
        <div className="addProductItem">
          <label>상품 재고</label>
          <input type="text" name="product_stock" placeholder="상품 재고" onChange={handleInputChange}></input>
        </div>
        <div className="addProductItem">
          <label>상품 설명</label>
          <input type="text" name="product_desc" placeholder="상품 설명" onChange={handleInputChange}></input>
        </div>
        <div className="addProductItem">
          <label>상품 카테고리</label>
          <select className="category-dropdown" name="category" onChange={handleInputChange}>
            <option value="">카테고리 선택</option>
            {categoryList.map(category => (
              <option key={category.id} value={category.id}>
                {category.category_name}
              </option>
            ))}
          </select>

        </div>
        <div className="addProductItem">
          <label>상품 이미지</label>
          <input type="file" id="file" onChange={handleInputChange} />
        </div>
        <button className="addProductButton">생성하기</button>
      </form>
    </div>
  )
}