import React, { useEffect, useState } from "react";
import './product.css';
import { Link } from "react-router-dom";
import Chart from "../../admin_conponents/chart/Chart";
import { productData } from "../../dummyData";
import { Publish } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import  PaymentButton  from "../../pages/Payment";

function UpdateProduct() {
  console.log("Update!")
}


export default function Product() {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [product, setProduct] = useState([]);
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetch("http://127.0.0.1:8000/shop/products/" + id + "/", {
      method: 'GET',
    }).then(response => response.json())
      .then(result => {
        console.log(result)
        setProduct(result)
      })
  }, []);

  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">상품</h1>
        <Link to="/admin_createProduct">
          <button className="productAddButton">생성하기</button>
        </Link>
        {product &&<PaymentButton product={product}/>}
      </div>
      <div className="productTop">
        <div className="productTopLeft">
          <Chart data={productData} dataKey="Sales" title="상품 판매량" />
        </div>
        <div className="productTopRight">
          <div className="productInfoTop">
            <img
              className="productInfoImg"
              src="https://m.wiisnt.co.kr/web/product/big/202209/866855c8f8ec769a655a44cd207bf6f1.jpg"
              alt=""
            />
            <span className="productName">{product.product_name}</span>
          </div>
          <div className="productInfoBottom">
            <div className="productInfoItem">
              <span className="productInfoKey">ID : </span>
              <span className="productInfoValue">만들어야되내</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">판매량 : </span>
              <span className="productInfoValue">3451</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">재고 상태 : </span>
              <span className="productInfoValue">341</span>
            </div>
          </div>
        </div>
      </div>
      <div className="productBottom">
        <form className="productForm">
          <div className="productFormLeft">
            <div className="productFormItem">
              <label>상품 명</label>
              <input type="text" placeholder="상품명" />
            </div>
            <div className="productFormItem">
              <label>재고 상태</label>
              <input tpye="text" placeholder="재료량" />
            </div>
          </div>
          <div className="productFormRight">
            <div className="productUpload">
              <img
                src="https://m.wiisnt.co.kr/web/product/big/202209/866855c8f8ec769a655a44cd207bf6f1.jpg"
                alt=""
                className="productUploadImg"
              />
              <label htmlFor="file">
                <Publish />
              </label>
              <input type="file" id="file" style={{ display: "none" }} />
            </div>
            <button className="productButton" onClick={UpdateProduct}>수정하기</button>
          </div>
        </form>
      </div>
    </div>
  )
};
