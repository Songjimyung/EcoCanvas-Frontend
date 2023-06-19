import React, { useEffect, useState } from "react";
import './orderList.css'
import Pagination from '@mui/material/Pagination';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Typography } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';

export default function AdminOrderList() {
  const [orderData, setOrderData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);



  useEffect(() => {
    const fetchProductList = async () => {
      try {
        let url = `${process.env.REACT_APP_BACKEND_URL}/shop/order/list/`;
        url += `?page=${currentPage}`;

        const response = await axios.get(url);
        const products = response.data.results.map((order) => {
          const status = order.order_info.length > 0 ? order.order_info[0].status : null;

          return {
            id: order.id,
            product: order.product,
            zipcode: order.zip_code,
            address: order.address,
            address_detail: order.address_detail,
            address_message: order.address_message,
            order_quantity: order.order_quantity,
            order_date: format(new Date(order.order_date), 'yyyy-MM-dd'),
            order_totalprice: order.order_totalprice,
            status: status,
            receiver_name: order.receiver_name,
            receiver_number: order.receiver_number,
          };
        });
        setOrderData(products);
        const totalPages = Math.ceil(response.data.count / 6);
        setTotalPages(totalPages);
        console.log(response.data.results)

      } catch (error) {
        console.error('상품 목록을 불러오는 중 오류가 발생했습니다:', error);
      }
    }
    fetchProductList();
  }, [currentPage]);



  const handleAction = (action) => {
    const token = localStorage.getItem('access');
    let updatedCampaign = { ...selected };

    if (action === 'approve') {
      updatedCampaign = { ...updatedCampaign, status: '2' };
    } else if (action === 'return') {
      updatedCampaign = { ...updatedCampaign, status: '0' };
    }
    fetch(`${process.env.REACT_APP_BACKEND_URL}/campaigns/status/${selected.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedCampaign)

    })
      .then(() => {
        alert(`캠페인 상태변경(${action === 'approve' ? '승인' : '반려'})이 완료되었습니다.`);
        setSelected(null);
        setOpen(false);
        window.location.reload();
      })
      .catch(error => {
        console.error(error);
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




  return (
    <div className="admin_home">
      <div className="widgetLg">
        <h3 className="widgetLgTitle">상품 주문내역</h3>
        <table className="widgetLgTable">
          <thead>
            <tr className="widgetLgTr">
              <th className="widgetLgTh">주문번호</th>
              <th className="widgetLgTh">주문자</th>
              <th className="widgetLgTh">상품</th>
              <th className="widgetLgTh">날짜</th>
              <th className="widgetLgTh">수량</th>
              <th className="widgetLgTh">상태</th>
              <th className="widgetLgTh">상세보기</th>
            </tr>
          </thead>
          <tbody>

            {orderData.length > 0 ? (
              orderData.map((order) => (
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
            ) : (
              <h2>주문내역이 없습니다.</h2>
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
                <Typography variant="body1">상품명: {selected.product}</Typography>
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
                <Typography variant="body1">주문수량: {selected.order_quantity}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">주문금액: {selected.order_totalprice}</Typography>
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
          <Button onClick={() => handleAction('approve')} style={{ fontSize: '20px', color: 'blue', margin: 'auto' }}>승인</Button>
          <Button onClick={() => handleAction('return')} style={{ fontSize: '20px', color: 'red', margin: 'auto' }}>반려</Button>
          <Button onClick={handleClose} style={{ fontSize: '20px', margin: 'auto' }}>닫기</Button>
        </DialogActions>
      </Dialog>
    </div>
  )

}

export { AdminOrderList };
