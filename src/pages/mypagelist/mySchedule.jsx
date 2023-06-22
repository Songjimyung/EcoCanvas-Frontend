import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../components/mypageSidebar/mypageSidebar.css'
import Sidebar from '../../components//mypageSidebar/MypageSidebar';

function ReceiptList() {
 const getUserFromLocalStorage = () => {
    const payload = localStorage.getItem('payload');
     if (payload) {
        const payload_data = JSON.parse(payload);
        const user_id = payload_data.user_id;
        return user_id;
        }
        return null;
     };
    
 const user_id = getUserFromLocalStorage();

 const [receipts, setReceipts] = useState([]);

 useEffect(() => {
    fetchReceipts();
 }, []);

 const fetchReceipts = () => {
    const token = localStorage.getItem('access');
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/payments/schedule/receipt/${user_id}`,
    {headers: {
        'Authorization': `Bearer ${token}`,
       }})
       .then((response) => {
          setReceipts(response.data);
       })
       .catch((error) => {
          console.error(error);
       });
    };

  return (
    <div>
     <div className="mypage-block">
      <Sidebar/>
      <div className="order-table-container">
       <h1>결제 내역</h1>
        <table className="widgetLgTable" style={{ borderCollapse: 'collapse'}}>
         <thead>
          <tr className='fundDetail' style={{border: '1px solid black'}}>
            <th className='fundingAmount' style={{border: '1px solid black'}}>펀딩 금액</th>
            <th className='fundingCampaign' style={{border: '1px solid black'}}>캠페인</th>
            <th className='fundingDate' style={{border: '1px solid black'}}>결제일시</th>
            <th className='fundingStatus' style={{border: '1px solid black'}}>상태</th>
            <th className='fundingrefund' style={{border: '1px solid black'}}>펀딩 취소</th>
          </tr>
         </thead>
        <tbody>
         {receipts.length > 0 ?(
          receipts.map((receipt) => (
            <tr className='fundDetail' key={receipt.id}>
                <td className='fundingAmount' style={{border: '1px solid black'}}>{receipt.amount}</td>
                <td className='fundingCampaign'style={{border: '1px solid black'}}>{receipt.campaign}</td>
                <td className='fundingDate'style={{border: '1px solid black'}}>{receipt.campaign_date}</td>
                <td className='fundingStatus'style={{border: '1px solid black'}}>{receipt.status[0]}</td>
                <td className='fundingrefund' style={{border: '1px solid black'}}>
                    {Object.keys(receipt.status)[0] === '0' ? <button>취소</button> :"결제 후 취소 불가" }
                </td>
            </tr>
            ))
            ) : (
                <h2>펀딩한 캠페인이 없습니다.</h2>
            )}
        </tbody>
      </table>        
      </div>
     </div>
    </div>
    );
};

export { ReceiptList };