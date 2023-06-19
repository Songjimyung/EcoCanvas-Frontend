import React, { useEffect, useState } from "react";
import './productList.css';
import { Link } from 'react-router-dom';
import { Pagination, Grid, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Button, Container } from '@mui/material';
import axios from 'axios';

export default function ProductList() {
  const [productList, setProductList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);


  const handlePageChange = async (event, page) => {
    setCurrentPage(page);
  };


  useEffect(() => {
    const fetchProductList = async () => {
      try {
        let url = 'http://localhost:8000/shop/products/admin/list/';
        url += `?page=${currentPage}`;

        const response = await axios.get(url);

        const products = response.data.results.map((product, index) => ({
          index: index,
          id: product.id,
          name: product.product_name,
          price: product.product_price,
          stock: product.product_stock,
          img: product.product_image
        }));

        setProductList(products);
        const totalPages = Math.ceil(response.data.count / 6);
        setTotalPages(totalPages);
      } catch (error) {
        console.error('상품 목록을 불러오는 중 오류가 발생했습니다:', error);
      }
    };

    fetchProductList();
  }, [currentPage]);


  return (
    <div className="productList">
      <Container>
        <TableContainer>
          <Table bordered={true.toString()}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productList.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>
                    <div className="productListItem">
                      <img className="productListImg" src={product.img} alt="" />
                      {product.name}
                    </div>
                  </TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>
                    <Link to={`/admin_product/detail/${product.id}`}>
                      <Button variant="contained" color="primary" className="productListEdit">
                        수정
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container justifyContent="center">
          <Pagination
            count={totalPages}
            page={currentPage}
            color="primary"
            onChange={handlePageChange}
          />
        </Grid>
      </Container>
    </div>
  );
}
