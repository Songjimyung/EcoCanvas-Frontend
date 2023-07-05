import React, { useEffect, useState } from "react";
import './orderList.css'
import Pagination from '@mui/material/Pagination';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Typography, Select, MenuItem } from '@mui/material';
import axios from 'axios';

export default function AdminOrderList() {
  const [orderData, setOrderData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");



  useEffect(() => {
    const fetchProductList = async () => {
      const token = localStorage.getItem("access");
      let url = '';

      if (selectedStatus === "all") {
        url = `${process.env.REACT_APP_BACKEND_URL}/shop/order/list/`;
      } else if (selectedStatus === "주문취소 요청") {
        url = `${process.env.REACT_APP_BACKEND_URL}/shop/products/admin/refund/`;
      }
      url += `?page=${currentPage}`;

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const products = response.data.results.map((order) => {
          const status = order.order_info.length > 0 ? order.order_info[0].status : null;

          return {
            id: order.id,
            product: order.product_name,
            zipcode: order.zip_code,
            address: order.address,
            address_detail: order.address_detail,
            address_message: order.address_message,
            order_quantity: order.order_quantity,
            order_date: order.order_date,
            order_totalprice: order.order_totalprice,
            status: status,
            receiver_name: order.receiver_name,
            receiver_number: order.receiver_number,
            order_info: order.order_info
          };
        });
        setOrderData(products);
        const totalPages = Math.ceil(response.data.count / 6);
        setTotalPages(totalPages);

      } catch (error) {
        alert(error);
      }
    }
    fetchProductList();
  }, [currentPage, selectedStatus]);



  const handleAction = (action) => {
    const token = localStorage.getItem('access');
    let updatedorder = { ...selected };
    let sendRefundRequest = false;

    if (action === 'approve') {
      updatedorder = { ...updatedorder, status: '2' };
    } else if (action === 'return') {
      updatedorder = { ...updatedorder, status: '1' };
      sendRefundRequest = true;
    }
    fetch(`${process.env.REACT_APP_BACKEND_URL}/shop/order/status/${selected.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedorder)

    })
      .then(() => {
        if (sendRefundRequest) {
          return fetch(`${process.env.REACT_APP_BACKEND_URL}/payments/refund/${selected.id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
        } else {
          return Promise.resolve();
        }
      })
      .then(() => {
        alert(`상태변경(${action === 'approve' ? '배송 준비 중' : '주문 취소'})처리가 완료되었습니다.`);
        setSelected(null);
        setOpen(false);
        window.location.reload();
      })
      .catch(error => {

      });
  };


  const handlePageChange = async (event, page) => {
    setCurrentPage(page);
  };



  const handleOpen = (orderId) => {
    const selectedOrder = orderData.find(order => order.id === orderId);
    setSelected(selectedOrder);
    setOpen(true);

  };

  const handleClose = () => {
    setSelected(null);
    setOpen(false);
  };
  const handleStatusFilter = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
  };
  const statusChoices = [
    { value: "all", label: "전체" },
    { value: "주문취소 요청", label: "주문취소 요청" }
  ];


  return (
    <div className="admin_home">
      <div className="widgetLg">
        <h3 className="widgetLgTitle">상품 주문내역</h3>
        <Select
          value={selectedStatus}
          onChange={handleStatusFilter}
          sx={{ width: "200px", margin: "30px auto 30px" }}
        >
          {statusChoices.map((choice) => (
            <MenuItem key={choice.value} value={choice.value}>
              {choice.label}
            </MenuItem>
          ))}
        </Select>
        <table className="widgetLgTable">
          <thead>
            <tr className="widgetLgTr">
              <th className="widgetLgTh">주문번호</th>
              <th className="widgetLgTh">주문자</th>
              <th className="widgetLgTh">날짜</th>
              <th className="widgetLgTh">상태</th>
              <th className="widgetLgTh">상세보기</th>
            </tr>
          </thead>
          <tbody>

            {orderData.length > 0 && (selectedStatus === "all" || selectedStatus === null) ? (
              orderData.map((order) => (
                <tr className="widgetLgTr" key={order.id}>
                  <td className="widgetLgName">
                    <span>{order.id}</span>
                  </td>
                  <td className="widgetLgDate">
                    <span>{order.receiver_name}</span>
                  </td>
                  <td className="widgetLgDate">
                    {order.order_date}
                  </td>
                  <td className="widgetLgDate">
                    {order.status}
                  </td>
                  <td className="widgetLgStatus">
                    <button className="details-button" onClick={() => handleOpen(order.id)}>세부 정보 보기</button>
                  </td>
                </tr>
              ))
            ) : (
              orderData.length === 0 ? (
                <h2>주문이 없습니다.</h2>
              ) : (
                orderData
                  .filter((order) => order.status === selectedStatus)
                  .map((order) => (
                    <tr className="widgetLgTr" key={order.id}>
                      <td className="widgetLgName">
                        <span>{order.id}</span>
                      </td>
                      <td className="widgetLgDate">
                        <span>{order.receiver_name}</span>
                      </td>
                      <td className="widgetLgDate">
                        {order.product}
                      </td>
                      <td className="widgetLgDate">
                        {order.order_date}
                      </td>
                      <td className="widgetLgDate">
                        {order.order_quantity}
                      </td>
                      <td className="widgetLgDate">
                        {order.status}
                      </td>
                      <td className="widgetLgStatus">
                        <button className="details-button" onClick={() => handleOpen(order.id)}>세부 정보 보기</button>
                      </td>
                    </tr>
                  ))
              )
            )}
          </tbody>
        </table>
      </div>
      <Grid container justifyContent="center">
        <Pagination
          count={totalPages}
          page={currentPage}
          color="primary"
          onChange={handlePageChange}
        />
      </Grid>
      <Dialog open={open} onClose={handleClose} style={{ textAlign: 'center' }}>
        <DialogTitle>주문 상세 정보</DialogTitle>
        <DialogContent>
          {selected && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1">주문 번호: {selected.id}</Typography>
              </Grid>
              <Grid item xs={12}>
                상품 / 수량

                {selected.order_info?.map((info, index) => (
                  <Typography variant="body1" key={index}>
                    <p>{info.product} / <span> {info.product_count}</span></p>
                  </Typography>
                ))}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">주문일: {selected.order_date}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">우편번호: {selected.zipcode}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">주소: {selected.address_detail}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">총 주문금액: {selected.order_totalprice}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">수령인: {selected.receiver_name}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">연락처: {selected.receiver_number}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">주문 현황: {selected.status}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleAction('approve')} style={{ fontSize: '20px', color: 'blue', margin: 'auto' }}>배송 준비 완료</Button>
          <Button onClick={() => handleAction('return')} style={{ fontSize: '20px', color: 'red', margin: 'auto' }}>주문 취소</Button>
          <Button onClick={handleClose} style={{ fontSize: '20px', margin: 'auto' }}>닫기</Button>
        </DialogActions>
      </Dialog>
    </div>
  )

}

export { AdminOrderList };
