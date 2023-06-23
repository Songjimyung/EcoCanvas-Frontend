import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from "../components/modal/Modal"

function SelectCard({ setSelectedCard }) {
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
    const [selectCard, setSelectCard] = useState('');
    const [SelectCardModalOpen, setSelectedCardModalOpen] = useState(false);
    const openPaymentModal = () => {
      setPaymentModalOpen(true);
    };
    const closePaymentModal = () => {
      setPaymentModalOpen(false);
    };
    const openSelectCardModal = () => {
        setSelectedCardModalOpen(true);
    };
    const closeSelectCardModal = () => {
        setSelectedCardModalOpen(false);
    };
  
    useEffect(() => {
      selectedCard();
    }, []);
  
    const selectedCard = () => {
      const token = localStorage.getItem('access');
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/payments/register/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {          
          setSelectCard(response.data);
        })
        .catch((error) => {
          console.error(error.response.data);
          alert('카드 정보를 가져오는데 실패했습니다.');
        });
    };
    

  const handleCardSelect = (cardId, cardNumber) => {
    setSelectedCard({cardId, cardNumber });
    console.log(cardId)
    closeSelectCardModal();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const cardNumber = `${cardNumber1}-${cardNumber2}-${cardNumber3}-${cardNumber4}`;
    const expiry = `${expiryYear}-${expiryMonth}`;

    const data = {
      card_number: cardNumber,
      expiry_at: expiry,
      birth: birth,
      pwd_2digit: pwd2Digit,
    };

    const token = localStorage.getItem('access');
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/payments/register/`, data,
    {headers: {
        'Authorization': `Bearer ${token}`,
      }})
      .then((response) => {
        console.log(response.data);
        alert('카드 등록 완료')
        selectedCard();
        closePaymentModal();
      })
      .catch((error) => {
        console.error(error.response.data);
        alert(error.response.data);
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
        selectedCard();
        console.log(response.data.message);
      })
      .catch((error) => {
        
        console.error(error);
      });
  };


  return (
    <div>
     <button onClick={openSelectCardModal}>카드선택</button>
      <Modal open={SelectCardModalOpen} close={closeSelectCardModal} header="결제카드 선택">
        <div>
        <button className= "paymentsaddbutton" onClick={(openPaymentModal)} style={{float:'right'}}>카드 등록</button>
        
        <Modal open={PaymentModalOpen} close={closePaymentModal} header="카드 등록하기">
        <form onSubmit={handleSubmit}>
          <input
              type="text"
              maxLength="4"
              placeholder="카드 번호 (0000)"
              value={cardNumber1}
              onChange={(event) => setCardNumber1(event.target.value)}
            />
            {' - '}
            <input
              type="text"
              maxLength="4"
              placeholder="0000"
              value={cardNumber2}
              onChange={(event) => setCardNumber2(event.target.value)}
            />
            {' - '}
            <input
              type="text"
              maxLength="4"
              placeholder="0000"
              value={cardNumber3}
              onChange={(event) => setCardNumber3(event.target.value)}
            />
            {' - '}
            <input
              type="text"
              maxLength="4"
              placeholder="0000"
              value={cardNumber4}
              onChange={(event) => setCardNumber4(event.target.value)}
            />
            <div>
              <input
                type="text"
                placeholder="유효년도 (YYYY)"
                value={expiryYear}
                onChange={(event) => setExpiryYear(event.target.value)}
              />
              {' - '}
              <input
                type="text"
                placeholder="유효월 (MM)"
                value={expiryMonth}
                onChange={(event) => setExpiryMonth(event.target.value)}
              />
              </div>
              <input
                type="text"
                placeholder="생년월일 (YYMMDD)"
                value={birth}
                onChange={(event) => setBirth(event.target.value)}
              />
              <input
                type="text"
                placeholder="비밀번호 앞 2자리"
                value={pwd2Digit}
                onChange={(event) => setPwd2Digit(event.target.value)}
              />
            <button type="submit">카드 등록</button>
          </form>
        </Modal>
        </div>
        <table className="widgetLgTable" style={{ borderCollapse: 'collapse'}}>
         <thead>
           <tr className='cardSelect' style={{border: '1px solid black'}}>
            <th className='cardNumber' style={{border: '1px solid black'}}>카드번호</th>
            <th className='cardSelected' style={{border: '1px solid black'}}>선택</th>
            <th className='cardDelte' style={{border: '1px solid black'}}>삭제</th>
          </tr>            
         </thead>
         <tbody>
         {selectCard.length > 0 ?( 
          selectCard.map((payment) => (
            <tr className='cardSelect' key={payment.id}>
              <td className='cardNumber' style={{border: '1px solid black'}}> 
                <span>{payment.card_number}</span>
              </td>
              <td className='cardSelected' style={{ border: '1px solid black' }}>
                <button onClick={() => handleCardSelect(payment.id, payment.card_number)}>선택</button>
                </td>
                <td className='cardDelete' style={{ border: '1px solid black' }}>
                <button onClick={() => handleDelete(payment.id)}>삭제</button>
                </td>
            </tr>
          ))
         ) : (
          <h2>등록된 카드가 없습니다. 카드를 먼저 등록해주세요</h2>
         )}
       </tbody>
      </table>
     </Modal>
    </div>
    
    );
}

export default SelectCard; 