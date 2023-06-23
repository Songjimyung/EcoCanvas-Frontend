import { Card, Grid, Typography, TextField, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
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
          `http://localhost:8000/shop/products/${productId}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();
        console.log(result);
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
        };
        setProduct(product_info);

        if (product_info.product_price === 0) {
          setIsSoldOut(true);
        } else {
          setIsSoldOut(false);
        }
      } catch (error) {
        console.log(error);
      }
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
        `http://127.0.0.1:8000/shop/products/${productId}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        console.log("수정 완료!");
        alert("수정 완료!");
        window.location.reload();
      } else {
        const result = await response.json();
        const errorValues = Object.values(result);
        throw new Error(errorValues.join("\n"));
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("access");
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/shop/products/${productId}/`,
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
        const result = await response.json();
        console.log(result);
        alert("삭제 실패!");
      }
    } catch (error) {
      console.log(error);
    }
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
    <div className="product-detail-wrap">
      <Card style={{ height: "800px" }}>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <img
                src={
                  image
                    ? image
                    : product.images
                    ? `http://127.0.0.1:8000${product.images}`
                    : product_default_img
                }
                alt={product.name}
                style={{
                  height: "400px",
                  width: "100%",
                  objectFit: "cover",
                  marginTop: "20px",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="product-detail-info">
                <Typography variant="h5" gutterBottom>
                  상품명
                </Typography>
                <TextField
                  name="product_name"
                  value={product.product_name}
                  onChange={(e) =>
                    setProduct({ ...product, product_name: e.target.value })
                  }
                  fullWidth
                />
                <Typography variant="subtitle1">
                  카테고리- {product.category_name}
                </Typography>
                <TextField
                  name="category_name"
                  value={product.category_name}
                  onChange={(e) =>
                    setProduct({ ...product, category_name: e.target.value })
                  }
                  fullWidth
                />
                <Typography variant="subtitle1">상품설명</Typography>
                <TextField
                  name="product_desc"
                  value={product.product_desc}
                  onChange={(e) =>
                    setProduct({ ...product, product_desc: e.target.value })
                  }
                  fullWidth
                  multiline
                  rows={4}
                />
                <Typography variant="subtitle1">
                  재고 : {product.product_stock}
                </Typography>
                <TextField
                  name="product_stock"
                  value={product.product_stock}
                  onChange={(e) =>
                    setProduct({ ...product, product_stock: e.target.value })
                  }
                  fullWidth
                />
                <Typography variant="subtitle1">
                  {isSoldOut
                    ? "품절"
                    : product && product.product_price
                    ? `${product.product_price.toLocaleString()}원`
                    : "N/A"}
                </Typography>
                <TextField
                  name="product_price"
                  value={product.product_price}
                  onChange={(e) =>
                    setProduct({ ...product, product_price: e.target.value })
                  }
                  fullWidth
                />
                <Grid item xs={12}>
                  <Typography variant="subtitle1">이미지 업로드</Typography>
                  <input
                    type="file"
                    id="file"
                    name="uploaded_images"
                    onChange={handleImageUpload}
                    multiple
                  />
                </Grid>
              </div>
            </Grid>
          </Grid>
          <Button
            type="submit"
            style={{ fontSize: "20px", color: "blue", margin: "auto" }}
          >
            Save
          </Button>
          <Button
            onClick={handleDelete}
            style={{ fontSize: "20px", color: "red", margin: "auto" }}
          >
            Delete
          </Button>
        </form>
      </Card>
    </div>
  );
}

export { ProductDetail };
