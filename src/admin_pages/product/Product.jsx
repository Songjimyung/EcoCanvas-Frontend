import React, { useEffect, useState } from "react";
import "./product.css";
import Chart from "../../admin_conponents/chart/Chart";
import { productData } from "../../dummyData";
import { Publish } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import product_default_img from "../../img/sample_product.png";

export default function ProductDetail() {
  const navigate = useNavigate();
  let { productId } = useParams();
  const [image, setImage] = useState("");
  const [product, setProduct] = useState({
    id: "",
    category_name: "",
    images: "",
    product_desc: "",
    product_name: "",
    product_price: "",
    product_stock: "",
  });
  const [isSoldOut, setIsSoldOut] = useState(false); // 품절 여부

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/shop/products/${productId}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        const product_info = {
          id: result.id,
          category_name: result.category_name,
          images:
            result.images && result.images[0]
              ? result.images[0]["image_file"]
              : null,
          product_desc: result.product_desc,
          product_name: result.product_name,
          product_price: result.product_price,
          product_stock: result.product_stock,
          sold_stock: result.sold_stock,
        };
        setProduct(product_info);

        if (product_info.product_price === 0) {
          setIsSoldOut(true);
        } else {
          setIsSoldOut(false);
        }
      } catch (error) {}
    };
    fetchProduct();
  }, [productId]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");
    if (
      !product.category_name ||
      !product.product_desc ||
      !product.product_name ||
      !product.product_price ||
      !product.product_stock
    ) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    const formData = new FormData();
    const fileInput = e.target.elements.uploaded_images;
    for (let i = 0; i < fileInput.files.length; i++) {
      formData.append("uploaded_images", fileInput.files[i]);
    }
    formData.append("category_name", product.category_name);
    formData.append("product_desc", product.product_desc);
    formData.append("product_name", product.product_name);
    formData.append("product_price", product.product_price);
    formData.append("product_stock", product.product_stock);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/shop/products/${productId}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        alert("수정 완료!");
        window.location.reload();
      } else {
        const result = await response.json();
        const errorValues = Object.values(result);
        throw new Error(errorValues.join("\n"));
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("access");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/shop/products/${productId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        alert("삭제 완료!");
        navigate("/admin-products");
      } else {
        alert("삭제 실패!");
      }
    } catch (error) {}
  };
  const handleImageUpload = (event) => {
    const files = event.target.files;
    const uploadedImages = Array.from(files);
    setProduct({ ...product, images: uploadedImages });

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(uploadedImages[0]);
  };

  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">상품</h1>
      </div>
      <div className="productTop">
        <div className="productTopLeft">
          <Chart data={productData} dataKey="Sales" title="상품 판매량" />
        </div>
        <div className="productTopRight">
          <div className="productInfoTop">
            <img
              src={
                image
                  ? image
                  : product.images
                  ? `${product.images}`
                  : product_default_img
              }
              alt={product.name}
              style={{ height: "30%", width: "30%" }}
            />
            <span className="productName">{product.product_name}</span>
          </div>
          <div className="productInfoBottom">
            <div className="productInfoItem">
              <span className="productInfoKey">ID : </span>
              <span className="productInfoValue">{product.id}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">판매량 : </span>
              <span className="productInfoValue">{product.sold_stock}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">재고 상태 : </span>
              <span className="productInfoValue">{product.product_stock}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="productBottom">
        <form className="productForm" onSubmit={handleFormSubmit}>
          <div className="productFormLeft">
            <div className="productFormItem">
              <label>카테고리</label>
              <input
                type="text"
                name="category_name"
                value={product.category_name}
                onChange={(e) =>
                  setProduct({ ...product, category_name: e.target.value })
                }
                fullWidth
              />
            </div>
            <div className="productFormItem">
              <label>상품 명</label>
              <input
                type="text"
                name="product_name"
                value={product.product_name}
                onChange={(e) =>
                  setProduct({ ...product, product_name: e.target.value })
                }
                fullWidth
              />
            </div>
            <div className="productFormItem">
              <label>상품 설명</label>
              <input
                type="text"
                name="product_desc"
                value={product.product_desc}
                onChange={(e) =>
                  setProduct({ ...product, product_desc: e.target.value })
                }
                fullWidth
              />
            </div>
            <div className="productFormItem">
              <label>재고 수량</label>
              <input
                type="text"
                value={product.product_stock}
                onChange={(e) =>
                  setProduct({ ...product, product_stock: e.target.value })
                }
                fullWidth
              />
            </div>
          </div>
          <div className="productFormItem">
            <label>
              {isSoldOut
                ? "품절"
                : product && product.product_price
                ? `${product.product_price.toLocaleString()}원`
                : "N/A"}
            </label>
            <input
              type="text"
              name="product_price"
              value={product.product_price}
              onChange={(e) =>
                setProduct({ ...product, product_price: e.target.value })
              }
              fullWidth
            />
          </div>
          <div className="productFormRight">
            <div className="productUpload">
              <img
                src={
                  image
                    ? image
                    : product.images
                    ? `${product.images}`
                    : product_default_img
                }
                alt={product.name}
                style={{ height: "300px", width: "300px" }}
              />
              <label htmlFor="file">
                <Publish />
              </label>
              <input
                type="file"
                id="file"
                style={{ display: "none" }}
                name="uploaded_images"
                onChange={handleImageUpload}
              />
            </div>
            <button type="submit" className="productButton">
              수정하기
            </button>
            <button
              type="submit"
              onClick={handleDelete}
              className="productButton"
              style={{ backgroundColor: "red" }}
            >
              삭제하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
