import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sidebar from "../../components/mypageSidebar/MypageSidebar"
import '../../components/mypageSidebar/mypageSidebar.css'
import Modal from "../../components/modal/Modal"
import '../../css/payment.css';

function RegisterPayment() {
  const [cardNumber1, setCardNumber1] = useState('');
  const [cardNumber2, setCardNumber2] = useState('');
  const [cardNumber3, setCardNumber3] = useState('');
  const [cardNumber4, setCardNumber4] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [birth, setBirth] = useState('');
  const [pwd2Digit, setPwd2Digit] = useState('');
  const [registerPayments, setRegisterPayments] = useState([]);
  const [PaymentModalOpen, setPaymentModalOpen] = useState(false);
  const openPaymentModal = () => {
    setPaymentModalOpen(true);
  };
  const closePaymentModal = () => {
    setPaymentModalOpen(false);
  };

  useEffect(() => {
    fetchRegisterPayments();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const cardNumber = `${cardNumber1}-${cardNumber2}-${cardNumber3}-${cardNumber4}`;
    const expiry = `${expiryYear}-${expiryMonth}`;

    const data = {
      card_number: cardNumber,
      expiry: expiry,
      birth: birth,
      pwd_2digit: pwd2Digit,
    };

    const token = localStorage.getItem('access');
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/payments/register/`, data,
    {headers: {
        'Authorization': `Bearer ${token}`,
      }})
      .then((response) => {
        
        alert('카드 등록 완료')
        fetchRegisterPayments();
        closePaymentModal();
      })
      .catch((error) => {
        console.log(error.response.data)
        if (error.response.status === 400) { 
        alert(Object.values(error.response.data)[0][0]);
        } else  {
        alert('카드 등록에 실패하였습니다. 카드 정보를 다시 확인해주세요.')
        }
      });
  };
  const fetchRegisterPayments = () => {
    const token = localStorage.getItem('access');
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/payments/register/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setRegisterPayments(response.data);
      })
      .catch((error) => {
        
        alert('카드 정보를 가져오는데 실패했습니다.');
      });
  };
  const handleDelete = (id) => {
    const token = localStorage.getItem('access');
    axios.delete(`${process.env.REACT_APP_BACKEND_URL}/payments/register/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data:{id:id},
      
    })
      .then((response) => {
        alert(response.data.message)
        setRegisterPayments(registerPayments.filter((payment) => payment.id !== id));
        
      })
      .catch((error) => {
        
        
      });
  };

  const cardNumber2Ref = useRef(null);
  const cardNumber3Ref = useRef(null);
  const cardNumber4Ref = useRef(null);
  const expiryYearRef = useRef(null);
  const expiryMonthRef = useRef(null);
  const birthRef = useRef(null);
  const pwdRef = useRef(null);

  const handleCardNumber1Change = (event) => {
    setCardNumber1(event.target.value);
    if (event.target.value.length === 4) {
      cardNumber2Ref.current.focus();
    }
  };
  const handleCardNumber2Change = (event) => {
    setCardNumber2(event.target.value);
    if (event.target.value.length === 4) {
      cardNumber3Ref.current.focus();
    }
  };
  const handleCardNumber3Change = (event) => {
    setCardNumber3(event.target.value);
    if (event.target.value.length === 4) {
      cardNumber4Ref.current.focus();
    }
  };
  const handleCardNumber4Change = (event) => {
    setCardNumber4(event.target.value);
    if (event.target.value.length === 4) {
      expiryYearRef.current.focus();
    }
  };
  const handleExpiryYearChange = (event) => {
    setExpiryYear(event.target.value);
    if (event.target.value.length === 4) {
      expiryMonthRef.current.focus();
    }
  };
  const handleExpiryMonthChange = (event) => {
    setExpiryMonth(event.target.value);
    if (event.target.value.length === 2) {
      birthRef.current.focus();
    }
  };
  const handleBirthChange = (event) => {
    setBirth(event.target.value);
    if (event.target.value.length === 6) {
      pwdRef.current.focus();
    } 

  };
  return (
    <div>
      <div className="mypage-block">
        <Sidebar/>
        <div className="order-table-container">
          <h1>카드 정보</h1>
        <button onClick={(openPaymentModal)} class= 'PaymentButton' style={{float:'right'}}>카드 등록</button>
        
        <Modal open={PaymentModalOpen} close={closePaymentModal} header="카드 등록하기">
        <form onSubmit={handleSubmit}>
          <input
              type="text"
              maxLength="4"
              placeholder="카드 번호 (0000)"
              class="CardNumberInput" 
              value={cardNumber1}
              onChange={handleCardNumber1Change}
            />
            {' - '}
            <input
              type="text"
              maxLength="4"
              placeholder="0000"
              class="CardNumberInput"
              value={cardNumber2}
              onChange={handleCardNumber2Change}
              ref={cardNumber2Ref}
            />
            {' - '}
            <input
              type="text"
              maxLength="4"
              placeholder="0000"
              class="CardNumberInput"
              value={cardNumber3}
              onChange={handleCardNumber3Change}
              ref={cardNumber3Ref}
            />
            {' - '}
            <input
              type="text"
              maxLength="4"
              placeholder="0000"
              class="CardNumberInput"
              value={cardNumber4}
              onChange={handleCardNumber4Change}
              ref={cardNumber4Ref}
            />
            <div>
              <input
                type="text"
                maxLength="4"
                placeholder="유효년도 (YYYY)"
                class="ExpiryInput"
                value={expiryYear}
                onChange={handleExpiryYearChange}
                ref={expiryYearRef}
              />
              {' - '}
              <input
                type="text"
                maxLength="2"
                placeholder="유효월 (MM)"
                class = "ExpiryMonthInput"
                value={expiryMonth}
                onChange={handleExpiryMonthChange}
                ref={expiryMonthRef}
              />
              </div>
              <input
                type="text"
                maxLength="6"
                placeholder="생년월일 (YYMMDD)"
                value={birth}
                class = "BirthInput"
                onChange={handleBirthChange}
                ref={birthRef}
              />
              <input
                type="text"
                maxLength="2"
                placeholder="비밀번호 앞 2자리"
                value={pwd2Digit}
                class = "PwdInput"
                onChange={(event) => setPwd2Digit(event.target.value)}
                ref={pwdRef}
              />
            <button class ="PaymentButton" type="submit">카드 등록</button>
          </form>
        </Modal>
      <div>
      
      <table className="widgetLgTable" style={{ borderCollapse: 'collapse'}}>
        <thead>
          <tr className='cardRegister' style={{border: '1px solid black'}}>
            <th className='cardNumber' style={{border: '1px solid black'}}>카드번호</th>
            <th className='cardDelte' style={{border: '1px solid black'}}>삭제</th>
          </tr>
        </thead>
        <tbody> 
         {registerPayments.length > 0 ?( 
          registerPayments.map((payment) => (
            <tr className='cardRegister' key={payment.id}>
              <td className='cardNumber' style={{border: '1px solid black'}}> 
                <span>{payment.card_number}</span>
              </td>
              <td className='cardDelete' style={{ border: '1px solid black' }}>
                <button class='DeleteButton'onClick={() => handleDelete(payment.id)}>삭제</button>
                </td>
            </tr>
      ))
         ) : (
          <h2>등록된 카드가 없습니다.</h2>
         )}
      </tbody>
      </table>
      </div>
    </div>
  </div>
  </div>
  );
}

export { RegisterPayment };