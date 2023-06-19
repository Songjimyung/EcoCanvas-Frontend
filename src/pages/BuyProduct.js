import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import '../css/product.css';
import { DataGrid } from '@mui/x-data-grid'
import DaumPostcode from "react-daum-postcode";
import { Modal, Button } from "antd";
import jwtDecode from 'jwt-decode';

export default function BuyProduct() {
  let { productId } = useParams();
  const [Product, setProduct] = useState(null);
  const [num, setNumber] = useState(0);
  const [Address, setAddress] = useState('');
  const [productPrice, setProductPrice] = useState(0); // 상품 가격 추가
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    receiver_name: "",
    receiver_number: "",
    zip_code: "",
    address: "",
    address_detail: "",
    address_message: "",
    order_quantity: "",
    order_totalprice: "",
    user: ""
  });
  const [userId, setUserId] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [loadProfileAddress, setLoadProfileAddress] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const onToggleModal = () => {
    setIsOpen((prev) => !prev);
  };
  const handleComplete = (data) => {
    console.log(data);
    setAddress(data.address);
    setZipcode(data.zonecode);
    setIsComplete(true);
    onToggleModal();
  };
  const increase = () => {
    setNumber(num + 1)
  }
  const decrease = () => {
    if (num > 0) {
      setNumber(num - 1);
    }
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('access');

        const response = await fetch(`http://localhost:8000/shop/products/${productId}/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();
        console.log(result);
        setProduct(result);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [productId]);
  useEffect(() => {
    // num 값이 변경될 때마다 productPrice 업데이트
    setProductPrice(Product ? Product.product_price * num : 0);
  }, [Product, num]);
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem('access');
        if (token) {
          const payload = jwtDecode(token);
          const userId = payload.user_id;
          console.log(userId);
          setUserId(userId);
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };
    fetchUserId();
  }, [productId]);


  const handleProfile = (e) => {
    const isChecked = e.target.checked;
    setLoadProfileAddress(isChecked);
    if (!isChecked) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        receiver_name: "",
        receiver_number: "",
        zip_code: "",
        address: "",
        address_detail: "",
        address_message: "",
      }));
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');

    console.log(e.target.elements.receiver_number.value)
    const formData = new FormData();
    formData.append('zip_code', isComplete ? zipcode : e.target.elements.zip_code.value);
    formData.append('address', isComplete ? Address : e.target.elements.address.value);
    formData.append('address_detail', e.target.elements.address_detail.value);
    formData.append('address_message', e.target.elements.address_message.value);
    formData.append('receiver_name', e.target.elements.receiver_name.value);
    formData.append('receiver_number', e.target.elements.receiver_number.value);
    formData.append('order_quantity', num);
    formData.append('order_totalprice', productPrice);
    formData.append('product', productId);
    formData.append('user', userId);


    fetch(`http://127.0.0.1:8000/shop/products/order/${productId}/`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        alert("상품 주문 완료!")
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    const fetchProfileAddress = async () => {
      try {
        const token = localStorage.getItem('access');
        if (token) {
          const response = await fetch(`http://localhost:8000/users/profile/`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const result = await response.json();
          console.log(result);
          const addressInfo = {
            receiver_name: result.receiver_name,
            receiver_number: result.receiver_number,
            zip_code: result.zip_code,
            address: result.address,
            address_detail: result.address_detail,
            address_message: result.address_message
          };
          setFormData((prevFormData) => ({
            ...prevFormData,
            ...addressInfo,
          }));
        }
      } catch (error) {
        console.error('오류', error);
      }
    };

    if (loadProfileAddress) {
      fetchProfileAddress();
    }
  }, [loadProfileAddress]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 120 },
    {
      field: 'product_name',
      headerName: 'Product',
      width: 200,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img className="productListImg" src={params.row.img} alt="" />
            {params.row.product_name}
          </div>
        );
      },
    },
    { field: 'product_desc', headerName: '상품정보', width: 200 },
    { field: 'product_price', headerName: 'Price', width: 200 },
    {
      field: 'action',
      headerName: '수량',
      width: 150,
      renderCell: () => {
        return (
          <>
            <button onClick={increase}>+1</button>
            <button onClick={decrease}>-1</button>
            <p>{num}</p>
          </>
        );
      },
    },
  ];

  return (
    <div className="product-detail-wrap">
      {Product ? (
        <>
          <div className="productList">
            <DataGrid
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } }
              }}
              rows={[Product]}
              disableSelectionOnClick
              columns={columns}
              pageSizeOptions={[5, 10, 15]}
              checkboxSelection
            />
          </div>
          <div className='product-detail'>
            <div className='product-detail-info'>
              <h1>ORDER</h1>
              <div className="createOrder">
                <div className="addOrderItem">
                  <label>기존 배송지 사용</label>
                  <input type="checkbox" name="load_profile_address" onChange={handleProfile} />
                </div>
                <form className="addOrderForm" onSubmit={handleFormSubmit}>
                  <div className="addOrderItem">
                    <label>받으시는 분</label>
                    <input type="text" name="receiver_name" onChange={handleInputChange} />
                  </div>
                  <div className="addOrderItem">
                    <label>휴대전화</label>
                    <input type="tel" name="receiver_number" value={formData.receiver_number} onChange={handleInputChange} maxLength="13" />
                  </div>
                  <div className="addOrderItem">
                    <label>주소</label>
                    <input type="address" name="address" value={isComplete ? Address : formData.address} onChange={handleInputChange} className="order-address" />
                    <Button type="primary" className="addProductButton" onClick={onToggleModal}>
                      주소 검색
                    </Button>
                    {isOpen && (
                      <Modal
                        visible={true}
                        onOk={onToggleModal}
                        onCancel={onToggleModal} // isOpen이 false가 되고 화면이 리렌더되면서 모달 사라짐
                      >
                        <DaumPostcode onComplete={handleComplete} />
                      </Modal>
                    )}
                  </div>
                  <div className="addOrderItem">
                    <label>우편번호</label>
                    <input type="address" name="zip_code" value={isComplete ? zipcode : formData.zip_code} onChange={handleInputChange} />
                  </div>
                  <div className="addOrderItem">
                    <label>상세주소</label>
                    <input type="address_detail" name="address_detail" value={formData.address_detail} onChange={handleInputChange} />
                  </div>
                  <div className="addOrderItem">
                    <label>배송메세지</label>
                    <input type="text" name="address_message" value={formData.address_message} onChange={handleInputChange} className="order-address" />
                  </div>
                  <div className='check-order'>
                    <p>주문 수량 : {num}</p>
                    <p>총 주문 금액 : {productPrice.toLocaleString()}won</p>
                    <button className="addProductButton">구매하기</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
