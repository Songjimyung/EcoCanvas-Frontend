import React, { useEffect, useState } from "react";
import Sidebar from "../../components/mypageSidebar/MypageSidebar";
import "../../css/mypage.css";
import Pagination from "@mui/material/Pagination";
import Grid from "@mui/material/Grid";
import axios from "axios";
// import { Link } from "react-router-dom";

const MyOrder = () => {
  const [myorderData, setMyOrderData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchOrderList = async () => {
      const token = localStorage.getItem("access");
      try {
        let url = `${process.env.REACT_APP_BACKEND_URL}/shop/mypage/order/`;
        url += `?page=${currentPage}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMyOrderData(response.data.results);
        const totalPages = Math.ceil(response.data.count / 6);
        setTotalPages(totalPages);

      } catch (error) {

      }
    };
    fetchOrderList();
  }, [currentPage]);

  const handlePageChange = async (event, page) => {
    setCurrentPage(page);
  };

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

  const selectedOrderData = myorderData.find(
    (order) => order.id === selectedOrder
  );

  const refundPayment = (selectedOrder) => {
    const token = localStorage.getItem("access");
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/payments/refund/${selectedOrder}`,
    {headers: {
      'Authorization': `Bearer ${token}`
    }})
    .then((response) => {
      alert(response.data.message)
      closeModal();
    })
    .catch((error) =>{
      console.log(error)
      alert("결제취소가 실패하였습니다.")
    }
      );

  }

  return (
    <div className="mypage-block">
      <Sidebar />
      <div className="order-table-container">
        <h1>주문 내역</h1>
        <table>
          <thead className="table-bar">
            <tr>
              <th>주문 번호</th>
              <th>상품명</th>
              <th>가격</th>
              <th>상태</th>
              <th>세부 정보</th>
            </tr>
          </thead>
          <tbody>
            {myorderData.length > 0 ? (
              myorderData.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.product_name}</td>
                  <td>{order.order_totalprice}</td>
                  <td>{order["order_info"][0]?.status || "알 수 없음"}</td>
                  <td>
                    <button
                      className="details-button"
                      onClick={() => openModal(order.id)}
                    >
                      세부 정보 보기
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <h2>주문내역이 없습니다.</h2>
            )}
          </tbody>
        </table>
        <Grid container justifyContent="center">
          <Pagination
            count={totalPages}
            page={currentPage}
            color="primary"
            onChange={handlePageChange}
          />
        </Grid>
      </div>
      <div id="orderModal" className="modal">
        <div className="modal-content">
          <span className="close-button" onClick={closeModal}>
            &times;
          </span>
          {selectedOrderData && (
            <div>
              <div className="order-details">
                <h2>주문 정보</h2>
                <div>
                  <p>주문 번호: {selectedOrderData.id}</p>
                  <p>수령인: {selectedOrderData.receiver_name}</p>
                  <p>상품명: {selectedOrderData.product_name}</p>
                  <p>가격: {selectedOrderData.order_totalprice}원</p>
                  <p>
                    주문상태:{" "}
                    <span style={{ color: "blue" }}>
                      {selectedOrderData["order_info"]?.[0]?.status ||
                        "알 수 없음"}
                    </span>
                  </p>
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
                  <button onClick={() => refundPayment(selectedOrderData.id)}class='DeleteButton' style={{width:'100px'}}>주문취소요청</button>
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
