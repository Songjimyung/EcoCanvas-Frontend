import React, { useEffect, useState } from "react";
import Sidebar from "../../components/mypageSidebar/MypageSidebar";
import "../../components/mypageSidebar/mypageSidebar.css";
import "../../css/mypage.css";
import { format } from 'date-fns';
import Pagination from '@mui/material/Pagination';

const MyOrder = () => {
  const [myorderData, setMyOrderData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentOrderPage, setCurrentOrderPage] = useState(1);
  const cardsPerPage = 5;

  useEffect(() => {
    const token = localStorage.getItem('access');

    fetch("http://127.0.0.1:8000/shop/mypage/order/", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(result => {
        const myorders = result.map((order) => ({
          id: order.id,
          product: order.product,
          order_totalprice: order.order_totalprice,
          status: order["order_info"][0]["status"],
          zip_code: order.zip_code,
          address: order.address,
          address_detail: order.address_detail,
          address_message: order.address_message,
          order_date: format(new Date(order.order_date), 'yyyy-MM-dd'),
          order_quantity: order.order_quantity,
          receiver_name: order.receiver_name,
          receiver_number: order.receiver_number
        }));
        setMyOrderData(myorders);
      });
  }, []);

  const handleOrderPageChange = (event, value) => {
    setCurrentOrderPage(value);
  };

  const indexOfLastOrderCard = currentOrderPage * cardsPerPage;
  const indexOfFirstOrderCard = indexOfLastOrderCard - cardsPerPage;
  const currentOrderCards = myorderData.slice(indexOfFirstOrderCard, indexOfLastOrderCard);

  const openModal = (orderId) => {
    setSelectedOrder(orderId);
    const modal = document.getElementById("orderModal");
    modal.style.display = "block";
  };

  const closeModal = () => {
    setSelectedOrder(null);
    const modal = document.getElementById("orderModal");
    modal.style.display = "none";
  };

  const selectedOrderData = myorderData.find(order => order.id === selectedOrder);

  return (
    <div className="mypage-block">
      <Sidebar />
      <div className="order-table-container">
        <h1>주문 내역</h1>
        <table>
          <thead>
            <tr>
              <th>주문 번호</th>
              <th>상품명</th>
              <th>가격</th>
              <th>상태</th>
              <th>세부 정보</th>
            </tr>
          </thead>
          <tbody>
            {currentOrderCards.length > 0 ? (
              currentOrderCards.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.product}</td>
                  <td>{order.order_totalprice}</td>
                  <td>{order.status}</td>
                  <td><button className="details-button" onClick={() => openModal(order.id)}>세부 정보 보기</button></td>
                </tr>
              ))
            ) : (
              <h2>주문내역이 없습니다.</h2>
            )}
          </tbody>
        </table>
        <div className="order-pagination">
          <Pagination
            count={Math.ceil(myorderData.length / cardsPerPage)}
            page={currentOrderPage}
            onChange={handleOrderPageChange}
            color="primary"
            size="large"
          />
        </div>
      </div>
      <div id="orderModal" className="modal">
        <div className="modal-content">
          <span className="close-button" onClick={closeModal}>&times;</span>
          {selectedOrderData && (
            <div>
              <div className="order-details">
                <h2>주문 정보</h2>
                <div>
                  <p>주문 번호: {selectedOrderData.id}</p>
                  <p>수령인: {selectedOrderData.receiver_name}</p>
                  <p>상품명: {selectedOrderData.product}</p>
                  <p>가격: {selectedOrderData.order_totalprice}원</p>
                  <p>주문상태: <span style={{ color: 'blue' }}>{selectedOrderData.status}</span></p>
                  <p>주문일: {selectedOrderData.order_date}</p>
                </div>
              </div>
              <div className="shipping-details">
                <h2>배송 정보</h2>
                <div>
                  <p>주문수량: {selectedOrderData.order_quantity}</p>
                  <p>우편번호: {selectedOrderData.zip_code}</p>
                  <p>주소: {selectedOrderData.address}</p>
                  <p>상세주소: {selectedOrderData.address_detail}</p>
                  <p>배송메세지: {selectedOrderData.address_message}</p>
                  <p>연락처: {selectedOrderData.receiver_number}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { MyOrder };
