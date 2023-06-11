import React, { useEffect, useState } from "react";
import './productList.css';
import { DataGrid } from '@mui/x-data-grid'
import { DeleteOutline } from '@mui/icons-material'
// import { productRows } from '../../dummyData'
import { Link } from 'react-router-dom'

export default function ProductList() {
    const [productList, setProductData] = useState([])
    useEffect(() => {
        fetch("http://127.0.0.1:8000/shop/products/list/", {
            method: 'GET',
        }).then(response => response.json())
            .then(result => {
                const products = result.map((product, index) => ({
                index:index,
                id: product.id,
                name: product.product_name,
                price: product.product_price,
                stock: product.product_stack,
                }));
                setProductData(products)
        })
    }, []);
    

    const handleDelete = (index) => {
        setProductData(productList.filter((item) => item.index !== index))
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
        { field: 'price', headerName: 'Price', width: 130,},
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
            initialState={{
                pagination: { paginationModel: { pageSize: 5}}
            }}
            rows={productList}
            disableSelectionOnClick
            columns={columns}
            pageSizeOptions={[5, 10, 15]}
            checkboxSelection
        />
    </div>
  )
}