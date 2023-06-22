import React, { useEffect } from 'react';
import axios from 'axios';

const getEmailFromLocalStorage = () => {
  const payload = localStorage.getItem('payload');
  if (payload) {
    const payload_data = JSON.parse(payload);
    const email = payload_data.email;
    const user_id = payload_data.user_id;
    return {email , user_id};
  }
  return {email:null, user_id:null};
};

const {email, user_id} = getEmailFromLocalStorage();
console.log(email);
console.log(user_id)

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
      const merchant_uid = 'Merchant' + makeMerchantUid
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
        const paid_imp_uid = response.imp_uid
        const paid_amount =response.paid_amount
        console.log(paid_imp_uid)
        console.log(paid_amount)


        if (response.success === true) {
          const token = localStorage.getItem('access');
          axios.post(`${process.env.REACT_APP_BACKEND_URL}/payments/receipt/${user_id}`, {merchant_uid: merchant_uid, imp_uid: paid_imp_uid, amount: paid_amount, product: product.id},
          {headers: {
            'Authorization': `Bearer ${token}`,
          }})
            .then(response => {
              console.log(response.data)
              alert("결제 성공!")
            });
          }else{
            console.log(response.data)
            alert(response.error_msg)
          }

      });

    }
  };

  return (
    <button onClick={requestPay}>결제하기</button>
  );
};



export default PaymentButton;