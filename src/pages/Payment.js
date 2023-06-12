import React, { useEffect } from 'react';
import axios from 'axios';

const getEmailFromLocalStorage = () => {
  const token = localStorage.getItem('payload');
  if (token) {
    const payload = JSON.parse(token);
    const email = payload.email;
    return email;
  }
  return null;
};

const email = getEmailFromLocalStorage();
console.log(email);

const PaymentButton = ({ product }) => {
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

  const requestPay = async () => {
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
      const makeMerchantUid =month + date + hours + minutes + seconds + milliseconds;
      const merchant_uid = 'IMP' + makeMerchantUid
      window.IMP.request_pay({
        pg: 'nice', 
        customer_uid: email,
        pay_method: 'card',
        merchant_uid: merchant_uid,
        name: product.product_name,
        amount: product.product_price,
        buyer_email: 'Iamport@chai.finance',
        buyer_name: '아임포트 기술지원팀',
        buyer_tel: '010-1234-5678',
        buyer_addr: '서울특별시 강남구 삼성동',
        buyer_postcode: '123-456',
      }, (response) => {
        console.log(merchant_uid);
        console.log(response);
        console.log(response.success);

        
        if (response.success === true) {
          axios.post('http://localhost:8000/payments/receipt/', {merchant_uid: merchant_uid})
            .then(response => {
              console.log(response.data)              
              
            })
         
        }
        
      }); 
      
    } 
  };

  return (
    <button onClick={requestPay}>결제하기</button>
  );
};



export default PaymentButton;