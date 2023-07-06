import React, { useEffect, useState } from "react";
import Sidebar from "../../components/mypageSidebar/MypageSidebar";
import "../../css/mypage.css";
import Pagination from "@mui/material/Pagination";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { Link } from "react-router-dom";

const MyOrder = () => {
  const [myorderData, setMyOrderData] = useState([]);
  const [myInfoData, setMyInfoData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [item, setItem] = useState([]);
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
        setMyOrderData(response.data.results.map(item => item['order_info']))

        setMyInfoData(response.data.results);
        const totalPages = Math.ceil(response.data.count / 3);
        setTotalPages(totalPages);
      } catch (error) {
      }
    };
    fetchOrderList();
  }, [currentPage]);
  const handlePageChange = async (event, page) => {
    setCurrentPage(page);
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    const modal = document.getElementById("orderModal");
    modal.style.display = "block";
    const matchingItem = myInfoData.find((item) => item.id === order.order);
    if (matchingItem) {
      setItem(matchingItem);
    };
  }
  const closeModal = () => {
    setSelectedOrder(null);
    const modal = document.getElementById("orderModal");
    modal.style.display = "none";
  };
  const selectedOrderData = myorderData.flat().find((order) => order.id === selectedOrder?.id);


  const detailReceipt = (orderId) => {
    const token = localStorage.getItem('access');

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/payments/receipt/detail/${orderId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      .then((response) => {
        window.open(response.data, '_blank');
      })
      .catch((error) => {
        console.log(error)
        alert('결제 영수증이 없습니다.')
      });
  };

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
              <th>수량</th>
              <th>상태</th>
              <th>세부 정보</th>
              <th>결제 영수증</th>
            </tr>
          </thead>
          <tbody>
            {myorderData.length > 0 ? (
              myorderData.map((orderArray, index) => (
                orderArray.reverse().map((order, innerIndex) => (
                  <tr key={`${index}-${innerIndex}`}>
                    <td>{order.id}</td>
                    <td>{order.product}</td>
                    <td>{order.product_count}</td>
                    <td>{order.status || "알 수 없음"}</td>
                    <td>
                      <button
                        className="details-button"
                        onClick={() => openModal(order)}
                      >
                        세부 정보 보기
                      </button>
                    </td>
                    <td>
                      <button
                        className="details-button"
                        style={{ width: '120px' }}
                        onClick={() => detailReceipt(order.id)}
                      >
                        영수증 보기
                      </button>
                    </td>
                  </tr>
                ))
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
                  <p>수령인: {item.receiver_name}</p>
                  <p>상품명 : {selectedOrderData.product}</p>
                  <p>주문수량: {selectedOrderData.product_count}개</p>
                  <p>
                    주문상태:{" "}
                    <span style={{ color: "blue" }}>
                      {item.order_info?.[0]?.status ||
                        "알 수 없음"}
                    </span>
                  </p>
                  <p>주문일: {item.order_date}</p>
                </div>
              </div>
              <div className="shipping-details">
                <h2>배송 정보</h2>
                <div>
                  <p>우편번호: {item.zip_code}</p>
                  <p>주소: {item.address}</p>
                  <p>상세주소: {item.address_detail}</p>
                  <p>배송메세지: {item.address_message}</p>
                  <p>연락처: {item.receiver_number}</p>

                  {selectedOrderData.order_info?.[0]?.status === "주문 접수 완료" && (
                    <Link to={`/mypage/myorder/${selectedOrderData.id}`}>
                      <button className="DeleteButton" style={{ width: '100px' }}>주문취소요청</button>
                    </Link>
                  )}
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
