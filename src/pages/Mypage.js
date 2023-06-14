import React, { useState } from "react";
import Pagination from '@mui/material/Pagination'; import Sidebar from "../components/mypageSidebar/mypageSidebar"
import '../components/mypageSidebar/mypageSidebar.css'

const Mypage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 10;

  const cards = [
    { title: "카드 1", content: "카드 1 내용" },
    { title: "카드 2", content: "카드 2 내용" },
    { title: "카드 3", content: "카드 3 내용" },
    { title: "카드 4", content: "카드 4 내용" },
    { title: "카드 5", content: "카드 5 내용" },
    { title: "카드 6", content: "카드 6 내용" },
    { title: "카드 7", content: "카드 7 내용" },
    { title: "카드 8", content: "카드 8 내용" },
    { title: "카드 9", content: "카드 9 내용" },
    { title: "카드 10", content: "카드 10 내용" },
    { title: "카드 11", content: "카드 11 내용" },
    { title: "카드 12", content: "카드 12 내용" },
  ];

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = cards.slice(indexOfFirstCard, indexOfLastCard);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  return (
    <>
      <div className="mypage-block">
        <Sidebar /><div className="card-section">
          {currentCards.map((card, index) => (
            <div className="card" key={index}>
              <h3>{card.title}</h3>
              <p>{card.content}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="pagination-container">
        <Pagination
          count={Math.ceil(cards.length / cardsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          size="large"
        />
      </div>
    </>
  );
};

export { Mypage };