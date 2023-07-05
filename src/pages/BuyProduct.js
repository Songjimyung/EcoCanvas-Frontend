import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import '../css/product.css';
import { DataGrid } from '@mui/x-data-grid'
import DaumPostcode from "react-daum-postcode";
import { Modal } from "antd";
import { Button } from '@mui/material'
import jwtDecode from 'jwt-decode';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';



export default function BuyProduct() {

  const navigate = useNavigate();
  let { productId } = useParams();
  const [Product, setProduct] = useState(null);
  const [num, setNumber] = useState(1);
  const [Address, setAddress] = useState('');
  const [productPrice, setProductPrice] = useState(0); // 상품 가격 추가
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [loadProfileAddress, setLoadProfileAddress] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [DeliveryMessage, setDeliveryMessage] = useState('');
  const [DetailAddress, setDetailAddress] = useState('');
  const [UserName, setUserName] = useState('');
  const [phonenum, setPhoneNum] = useState('');
  const phoneRef = useRef('');


  const onToggleModal = () => {
    setIsOpen((prev) => !prev);
  };
  const handleComplete = (data) => {

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
      const token = localStorage.getItem('access');
      if (token) {
        try {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shop/products/${productId}/`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const result = await response.json();

          setProduct(result);
        } catch (error) {
          console.error(error);
        }
      } else {
        alert("로그인이 필요합니다.")
        window.location.replace('/login')
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

          setUserId(userId);
        }
      } catch (error) {

      }
    };
    fetchUserId();
  }, [productId]);


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
  }


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');
    const receiver_number = e.target.elements.receiver_number.value;
    if (receiver_number.length !== 13) {
      alert("휴대전화 번호를 올바르게 입력해주세요.");
      return;
    }


    const orders = [{
      receiver_name: e.target.elements.receiver_name.value,
      receiver_number: e.target.elements.receiver_number.value,
      zip_code: isComplete ? zipcode : e.target.elements.zip_code.value,
      address: isComplete ? Address : e.target.elements.address.value,
      address_detail: e.target.elements.address_detail.value,
      address_message: e.target.elements.address_message.value,
      order_quantity: num,
      order_totalprice: productPrice,
      user: userId,
      product: parseInt(productId),
    }];

    try {
      await requestPay();


      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shop/products/order/`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orders }),
      });

      if (response.ok) {
        await response.json();
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
            name: Product.product_name,
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
    // 입력값이 13자일 때만 상태값 업데이트

    phoneRef.current.value = result;
    setPhoneNum(e.target.value);


  };


  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'product_name',
      headerName: '상품명',
      width: 200,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img className="productListImg" src={params.row.images[0].image_file} alt="" />
            {params.row.product_name}
          </div>
        );
      },
    },
    { field: 'product_desc', headerName: '상품정보', width: 250 },
    { field: 'product_price', headerName: '가격', width: 150 },
    {
      field: 'action',
      headerName: '수량',
      width: 150,
      renderCell: () => {
        return (
          <>
            <input
              type="number"
              value={num}
              onChange={(e) => setNumber(parseInt(e.target.value))}
              style={{ margin: "2px 20px 0 0", width: "60px" }}
            />
            <button onClick={increase} className="num-button">
              +1
            </button>
            <button onClick={decrease} className="num-button" style={{ marginLeft: "5px" }}>
              -1
            </button>
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
            <h1 style={{ margin: "50px auto" }}>주문 목록</h1>
            <DataGrid
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } }
              }}
              rows={[Product]}
              disableSelectionOnClick
              columns={columns}
              pageSizeOptions={[5, 10, 15]}
              sx={{
                marginTop: "20px"
              }}
            />
          </div>
          <div className='product-detail'>
            <div className='product-detail-info'>
              <h1 style={{ margin: "30px auto" }}>ORDER</h1>
              <div className="createOrder">
                <div className="addOrderItem">
                  <label>기존 배송지 사용</label>
                  <input type="checkbox" name="load_profile_address" onChange={handleProfile} />
                </div>
                <form className="addOrderForm" onSubmit={handleFormSubmit}>
                  <div className="addOrderItem">
                    <label>받으시는 분</label>
                    <input type="text"
                      name="receiver_name"
                      value={UserName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="addOrderItem">
                    <label>휴대전화</label>
                    <input
                      type="tel"
                      name="receiver_number"
                      value={phonenum}
                      ref={phoneRef}
                      onChange={handlePhone}
                      maxLength="13"
                      required
                    />
                  </div>
                  <div className="addOrderItem">
                    <label>주소</label>
                    <input type="address"
                      name="address"
                      value={Address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="order-address"
                      required
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
                    <input type="address"
                      name="zip_code"
                      value={zipcode}
                      onChange={(e) => setZipcode(e.target.value)}
                      required
                    />
                  </div>
                  <div className="addOrderItem">
                    <label>상세주소</label>
                    <input type="address_detail"
                      name="address_detail"
                      value={DetailAddress}
                      onChange={(e) => setDetailAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div className="addOrderItem">
                    <label>배송메세지</label>
                    <input type="text"
                      name="address_message"
                      value={DeliveryMessage}
                      onChange={(e) => setDeliveryMessage(e.target.value)}
                      className="order-address"
                      required
                    />
                  </div>
                  <div className='check-order'>
                    <p>주문 수량 : {num}</p>
                    <p>총 주문 금액 : {productPrice.toLocaleString()} 원</p>
                  </div>
                  <button
                    className="PayProductButton"
                  >구매하기</button>
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
};
