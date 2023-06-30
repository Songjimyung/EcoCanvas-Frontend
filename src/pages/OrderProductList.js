import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DaumPostcode from "react-daum-postcode";
import { Modal } from "antd";

import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Button,
  Container,
} from "@mui/material";
import { useNavigate } from 'react-router-dom';


const OrderProductList = () => {
  const [phonenum, setPhoneNum] = useState('');
  const phoneRef = useRef();
  const navigate = useNavigate();
  const [Address, setAddress] = useState('');
  const [productPrice, setProductPrice] = useState(0); // 상품 가격 추가
  const [isOpen, setIsOpen] = useState(false);
  const [zipcode, setZipcode] = useState('');
  const [loadProfileAddress, setLoadProfileAddress] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const payload = JSON.parse(localStorage.getItem('payload'));
  const userId = payload ? payload.user_id : '';
  const [DeliveryMessage, setDeliveryMessage] = useState('');
  const [DetailAddress, setDetailAddress] = useState('');
  const [UserName, setUserName] = useState('');




  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem(`cartItems_${userId}`)) || [];
    setCartItems(storedCartItems);
  }, [userId]);

  const onToggleModal = () => {
    setIsOpen((prev) => !prev);
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');
    const orders = cartItems.map((product) => ({
      zip_code: isComplete ? zipcode : e.target.elements.zip_code.value,
      address: isComplete ? Address : e.target.elements.address.value,
      address_detail: e.target.elements.address_detail.value,
      address_message: e.target.elements.address_message.value,
      receiver_name: e.target.elements.receiver_name.value,
      receiver_number: phonenum,
      order_quantity: product.quantity,
      order_totalprice: product.product_price * product.quantity,
      product: product.id,
      user: userId,
    }));

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/shop/products/order/`, { orders }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await response.json();
        // console.log(response)
        navigate('/mypage/myorders');
      } else {
        const data = await response.json();
        const errorValues = Object.values(data);
        throw new Error(errorValues.join('\n'));
      }
    } catch (error) {
      console.error(error);
      alert("결제 오류! 다시 결제해주세요");
    }
  };

  const handlePhone = (e) => {
    const value = phoneRef.current.value.replace(/\D+/g, "");
    const numberLength = 11;

    let result;
    result = "";

    for (let i = 0; i < value.length && i < numberLength; i++) {
      switch (i) {
        case 3:
          result += "-";
          break;
        case 7:
          result += "-";
          break;

        default:
          break;
      }

      result += value[i];
    }

    phoneRef.current.value = result;

    setPhoneNum(e.target.value);
  };
  const handleProfile = (e) => {
    const isChecked = e.target.checked;
    setLoadProfileAddress(isChecked);
    if (!isChecked) {
      setAddress("");
    }
  };

  const handleComplete = (data) => {
    setAddress(data.address);
    setZipcode(data.zonecode);
    setIsComplete(true);
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchProfileAddress = async () => {
      try {
        const token = localStorage.getItem('access');
        if (token) {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/profile/`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const result = await response.json();
          console.log(result)
          setDeliveryMessage(result.delivery_message)
          setPhoneNum(result.receiver_number);
          setAddress(result.address);
          setDetailAddress(result.detail_address)
          setZipcode(result.zip_code);
          setUserName(result.user['username'])
          setIsComplete(true);
        }
      } catch (error) {

      }
    };

    if (loadProfileAddress) {
      fetchProfileAddress();
    }
  }, [loadProfileAddress]);






  return (
    <div>
      <h1>ORDER</h1>
      {cartItems.length > 0 ? (
        <Container>
          <TableContainer>
            <Table bordered={true.toString()}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>상품</TableCell>
                  <TableCell>가격</TableCell>
                  <TableCell>수량</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>
                      <div className="productListItem">
                        <img className="productListImg" src={product.img} alt="" />
                        {product.product_name}
                      </div>
                    </TableCell>
                    <TableCell>{product.product_price}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      ) : (
        <p>상품이 없습니다.</p>
      )}
      <div className="product-detail">
        <div className="product-detail-info">
          <div className="createOrder">
            <div className="addOrderItem">
              <label>기존 배송지 사용</label>
              <input type="checkbox" name="load_profile_address" onChange={handleProfile} />
            </div>
            <form className="addOrderForm" onSubmit={handleFormSubmit}>
              <div className="addOrderItem">
                <label>받으시는 분</label>
                <input
                  type="text"
                  name="receiver_name"
                  value={isComplete ? UserName : ""}
                />
              </div>
              <div className="addOrderItem">
                <label>휴대전화</label>
                <input
                  type="tel"
                  name="receiver_number"
                  ref={phoneRef}
                  value={isComplete ? phonenum : ""}
                  onChange={handlePhone}
                  maxLength="13"
                  readOnly={isComplete}
                />
              </div>
              <div className="addOrderItem">
                <label>주소</label>
                <input
                  type="text"
                  name="address"
                  value={isComplete ? Address : ""}
                  className="order-address"
                  readOnly={isComplete}
                />
                <Button
                  variant="contained"
                  color="primary"
                  className="addProductButton"
                  onClick={onToggleModal}
                  sx={{ color: "white" }}
                >
                  주소 검색
                </Button>
                {isOpen && (
                  <Modal visible={true} onOk={onToggleModal} onCancel={onToggleModal}>
                    <DaumPostcode onComplete={handleComplete} />
                  </Modal>
                )}
              </div>
              <div className="addOrderItem">
                <label>우편번호</label>
                <input
                  type="text"
                  name="zip_code"
                  value={isComplete ? zipcode : ""}
                  readOnly={isComplete}
                />
              </div>
              <div className="addOrderItem">
                <label>상세주소</label>
                <input
                  type="text"
                  name="address_detail"
                  value={isComplete ? DetailAddress : ""}
                />
              </div>
              <div className="addOrderItem">
                <label>배송메세지</label>
                <input
                  type="text"
                  name="address_message"
                  value={isComplete ? DeliveryMessage : ""}
                  className="order-address"
                />
              </div>
              <div className="check-order">
                {/* <p>주문 수량 : {num}</p> */}
                <p>총 주문 금액 : {productPrice.toLocaleString()} 원</p>
              </div>
              <button className="PayProductButton">구매하기</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};


export { OrderProductList };