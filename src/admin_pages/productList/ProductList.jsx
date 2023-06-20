import React, { useEffect, useState } from "react";
import './productList.css';
import { DeleteOutline } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import Pagination from '@mui/material/Pagination';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';

export default function ProductList() {
  const [productList, setProductList] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handlePageChange = async (event, page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchProductList = async () => {
      try {
        let url = `${process.env.REACT_APP_BACKEND_URL}/shop/products/admin/list/`;
        url += `?page=${currentPage}`;

        const response = await axios.get(url);
        const products = response.data.results.map((product, index) => ({
          index: index,
          id: product.id,
          name: product.product_name,
          price: product.product_price,
          stock: product.product_stack,
          img: product.product_image
        }));
        setProductList(products);
        const totalPages = Math.ceil(response.data.count / 6);
        setTotalPages(totalPages);
        console.log(products)
      } catch (error) {
        console.error('상품 목록을 불러오는 중 오류가 발생했습니다:', error);
      }

    }
    fetchProductList();
  }, [currentPage]);


  const handleDelete = (index) => {
    setProductList(productList.filter((item) => item.index !== index))
  }

  const columns = [
    {
      field: 'index',
      headerName: 'Index',
      width: 70,
      renderCell: (params) => {
        return <span>{params.row.index}</span>;
      },
    },
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'product',
      headerName: 'Product',
      width: 200,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img className="productListImg" src={params.row.img} alt="" />
            {params.row.name}
          </div>
        )
      },
    },
    { field: 'stock', headerName: 'Stock', width: 200 },
    { field: 'price', headerName: 'Price', width: 130, },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={'/products/' + params.row.id}>
              <button className="productListEdit">수정</button>
            </Link>
            <DeleteOutline
              className="productListDelete"
              onClick={() => handleDelete(params.row.id)}
            />
          </>
        )
      },
    },
  ]

  return (
    <div className="productList">
      <DataGrid
        rows={productList}
        columns={columns}
        autoHeight
        checkboxSelection={false}
        disableSelectionOnClick
      />
      <Grid container justifyContent="center">
        <Pagination
          count={totalPages}
          page={currentPage}
          color="primary"
          onChange={handlePageChange}
        />
      </Grid>
    </div>
  );
}