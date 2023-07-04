import React, { useState, useEffect, useRef } from "react";
import DaumPostcode from "react-daum-postcode";
import { Modal } from "antd";
import axios from 'axios';

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
  const phoneRef = useRef('');
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
  const [num, setNumber] = useState(0);


  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem(`cartItems_${userId}_order`)) || [];
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
      address_detail: isComplete ? DetailAddress : e.target.elements.address_detail.value,
      address_message: isComplete ? DeliveryMessage : e.target.elements.address_message.value,
      receiver_name: isComplete ? UserName : e.target.elements.receiver_name.value,
      receiver_number: isComplete ? phonenum : e.target.elements.receiver_number.value,
      order_quantity: product.quantity,
      order_totalprice: product.product_price * product.quantity,
      product: product.id,
      user: userId,
    }));

    try {
      await requestPay();

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shop/products/order/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orders })
      });

      if (response.status === 201) {
        await response.json();
        localStorage.removeItem(`cartItems_${userId}_order`);
        navigate('/mypage/myorders');
      } else if (response.status === 400) {
        const data = await response.json();
        const errorValues = Object.values(data);
        const errorMessage = errorValues.join('\n');
        alert(errorMessage);
      } else {
      }
    } catch (error) {
      alert("결제 오류! 다시 결제해주세요");
    }

  };
  useEffect(() => {
    const loadScript = async () => {
      // jQuery 스크립트 로드
      const jQueryScript = document.createElement('script');
      jQueryScript.src = 'https://code.jquery.com/jquery-1.12.4.min.js';
      jQueryScript.async = true;
      document.body.appendChild(jQueryScript);

      // iamport.payment.js 스크립트 로드
      const iamportScript = document.createElement('script');
      iamportScript.src = 'https://cdn.iamport.kr/js/iamport.payment-1.2.0.js';
      iamportScript.async = true;
      document.body.appendChild(iamportScript);
    };
    loadScript();
  }, []);

  // const navigate = useNavigate();
  const getEmailFromLocalStorage = () => {
    const payload = localStorage.getItem('payload');
    if (payload) {
      const payload_data = JSON.parse(payload);
      const email = payload_data.email;
      const user_id = payload_data.user_id;
      return { email, user_id };
    }
    return { email: null, user_id: null };
  };

  const { email, user_id } = getEmailFromLocalStorage();

  const requestPay = async () => {
    return new Promise((resolve, reject) => {
      // iamport.payment.js 스크립트 로드 완료 후 실행
      if (window.IMP) { 
        window.IMP.init('imp25228615');

        const today = new Date();
        const month = today.getMonth();
        const date = today.getDate();
        const hours = today.getHours();
        const minutes = today.getMinutes();
        const seconds = today.getSeconds();
        const milliseconds = today.getMilliseconds();
        const makeMerchantUid = month + date + hours + minutes + seconds + milliseconds;
        const merchant_uid = 'Merchant' + makeMerchantUid;
        const customer_uid = email + makeMerchantUid;
        window.IMP.request_pay(
          {
            pg: 'nice',
            customer_uid: customer_uid,
            pay_method: 'card', 
            merchant_uid: merchant_uid, 
            name: '다중상품',
            amount: productPrice,
            buyer_email: email,
            buyer_name: UserName,
            buyer_tel: phonenum,
            buyer_addr: Address + DetailAddress,
            buyer_postcode: zipcode,
          },
          (response) => {
            const paid_imp_uid = response.imp_uid;
            const paid_amount = response.paid_amount;


            if (response.success === true) {
              const token = localStorage.getItem('access');
              axios
                .post(
                  `${process.env.REACT_APP_BACKEND_URL}/payments/receipt/${user_id}`,
                  { merchant_uid: merchant_uid, imp_uid: paid_imp_uid, amount: paid_amount },
                  {
                    headers: {
                      'Authorization': `Bearer ${token}`,
                    },
                  }
                )
                .then((response) => {
                  alert("결제 성공!");
                  resolve(); // Promise가 성공 상태로 처리됨
                })
                .catch((error) => {
                  console.error(error);
                  alert(error.message);
                  reject(); // Promise가 실패 상태로 처리됨
                });
            } else {
              alert(response.error_msg);
              reject(); // Promise가 실패 상태로 처리됨
            }
          }
        );
      }
    });
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
      setPhoneNum("");
      setZipcode("");
      setDetailAddress("");
      setDeliveryMessage("");
      setUserName("");
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

  useEffect(() => {
    let totalQuantity = 0;
    let totalPrice = 0;

    for (const product of cartItems) {
      totalQuantity += product.quantity;
      totalPrice += product.product_price * product.quantity;
    }

    setNumber(totalQuantity);
    setProductPrice(totalPrice);
  }, [cartItems]);



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
                        <img className="productListImg"
                          src={product.images[0].image_file}
                          alt="장바구니 미리보기"
                        />
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
                  value={UserName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="addOrderItem">
                <label>휴대전화</label>
                <input
                  type="tel"
                  name="receiver_number"
                  ref={phoneRef}
                  value={phonenum}
                  onChange={handlePhone}
                  maxLength="13"
                />
              </div>
              <div className="addOrderItem">
                <label>주소</label>
                <input
                  type="text"
                  name="address"
                  value={Address}
                  className="order-address"
                  onChange={(e) => setAddress(e.target.value)}
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
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}

                />
              </div>
              <div className="addOrderItem">
                <label>상세주소</label>
                <input
                  type="text"
                  name="address_detail"
                  value={DetailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                />
              </div>
              <div className="addOrderItem">
                <label>배송메세지</label>
                <input
                  type="text"
                  name="address_message"
                  value={DeliveryMessage}
                  className="order-address"
                  onChange={(e) => setDeliveryMessage(e.target.value)}
                />
              </div>
              <div className="check-order">
                <p>총 주문 수량 : {num}</p>
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
