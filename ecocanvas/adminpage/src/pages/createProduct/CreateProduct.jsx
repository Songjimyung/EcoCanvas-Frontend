import React, { useEffect, useState } from "react";
import './createProduct.css'

export default function CreateProduct() {
    const [formData, setFormData] = useState({
        image: "",
        name: "",
        stock: "",
        desc: "",
        category: "",
        price: ""
    });
    const [categoryList, setCategoryList] = useState([]);
    useEffect(() => {
        fetch("http://127.0.0.1:8000/shop/categorys/list/", {
            method: 'GET',
        }).then(response => response.json())
            .then(result => {
                console.log(result)
                setCategoryList(result);
        })
    }, []);
    
    const handleFormSubmit = (e) => {
        e.preventDefault();
        fetch("http://127.0.0.1:8000/shop/products/" + formData.category + '/', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(result => {
                console.log(result)
            })
        console.log(formData);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    return (
        <div className="createProduct">
            <h1 className="addProductTitle">상품 생성</h1>
            <form className="addProductForm" onSubmit={handleFormSubmit}>
                <div className="addProductItem">
                    <label>상품 이름</label>
                    <input type="text" name="name" placeholder="상품 이름" onChange={handleInputChange}></input>
                </div>
                <div className="addProductItem">
                    <label>상품 가격</label>
                    <input type="text" name="price" placeholder="상품 가격" onChange={handleInputChange}></input>
                </div>
                <div className="addProductItem">
                    <label>상품 재고</label>
                    <input type="text" name="stock" placeholder="상품 재고" onChange={handleInputChange}></input>
                </div>
                <div className="addProductItem">
                    <label>상품 설명</label>
                    <input type="text" name="desc" placeholder="상품 설명" onChange={handleInputChange}></input>
                </div>
                <div className="addProductItem">
                    <label>상품 카테고리</label>
                    <select className="addProductSelect" name="category" onChange={handleInputChange}>
                        {categoryList.map(category => (
                            <option key={category.id} value={category.id}>{category.category_name}</option>
                        ))}
                    </select>
                </div>
                <div className="addProductItem">
                    <label>상품 이미지</label>
                    <input type="file" id="file" onChange={handleInputChange}/>
                </div>
                <button className="addProductButton">생성하기</button>
            </form>
        </div>
    )
}