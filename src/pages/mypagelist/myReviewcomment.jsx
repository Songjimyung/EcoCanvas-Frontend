import React, { useEffect, useState } from "react";
import Pagination from '@mui/material/Pagination';
import Sidebar from "../../components/mypageSidebar/MypageSidebar";
import "../../css/mypage.css";
import '../../components/mypageSidebar/mypageSidebar.css';
import { Link } from 'react-router-dom';

const MyReviewComment = () => {
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const [currentCommentPage, setCurrentCommentPage] = useState(1);
  const [reviewData, setReviewData] = useState([]);
  const [commentData, setCommentData] = useState([]);
  const cardsPerPage = 5;

  //마이페이지 리뷰 GET
  useEffect(() => {
    const token = localStorage.getItem('access');

    fetch("http://127.0.0.1:8000/campaigns/mypage/review/", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(result => {
        const reviews = result.map((review) => ({
          id: review.id,
          title: review.title,
          content: review.content,
          campaign: review.campaign,
          user: review.author
        }));
        setReviewData(reviews);
      });
  }, []);

  //마이페이지 댓글 GET
  useEffect(() => {
    const token = localStorage.getItem('access');
    fetch("http://127.0.0.1:8000/campaigns/mypage/comment/", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(result => {
        const comments = result.map((comment) => ({
          id: comment.id,
          content: comment.content,
          campaign: comment.campaign_title,
          user: comment.author,
          campaign_id: comment.campaign
        }));
        console.log(result)
        setCommentData(comments);
      });
  }, []);

  const handleReviewPageChange = (event, value) => {
    setCurrentReviewPage(value);
  };

  const handleCommentPageChange = (event, value) => {
    setCurrentCommentPage(value);
  };

  const indexOfLastReviewCard = currentReviewPage * cardsPerPage;
  const indexOfFirstReviewCard = indexOfLastReviewCard - cardsPerPage;
  const currentReviewCards = reviewData.slice(indexOfFirstReviewCard, indexOfLastReviewCard);

  const indexOfLastCommentCard = currentCommentPage * cardsPerPage;
  const indexOfFirstCommentCard = indexOfLastCommentCard - cardsPerPage;
  const currentCommentCards = commentData.slice(indexOfFirstCommentCard, indexOfLastCommentCard);

  return (
    <div>
      <div className="mypage-block">
        <Sidebar />
        <div className="mypage-container-review">
          <div className="mypage-comments">
            <h2>My Reviews</h2>
            {currentReviewCards.map((card, index) => (
              <div className="comment-list" key={index}>
                <div className="comment">
                  <div className="comment-info">
                    <span className="comment-date">
                      <Link to={`/campaign/${card.campaign}`}>{card.title}</Link>
                    </span>
                    <span className="comment-author">{card.user}</span>
                  </div>
                  <p className="comment-content">{card.content}</p>
                </div>
              </div>
            ))}
            <div className="review-pagination">
              <Pagination
                count={Math.ceil(reviewData.length / cardsPerPage)}
                page={currentReviewPage}
                onChange={handleReviewPageChange}
                color="primary"
                size="large"
              />
            </div>
          </div>
          <div className="mypage-comments">
            <h2>My Comments</h2>
            {currentCommentCards.map((card, index) => (
              <div className="comment-list" key={index}>
                <div className="comment">
                  <div className="comment-info">
                    <span className="comment-date">
                      <Link to={`/campaign/${card.campaign_id}`}>{card.campaign}</Link>
                    </span>
                    <span className="comment-author">{card.user}</span>
                  </div>
                  <p className="comment-content">{card.content}</p>
                </div>
              </div>
            ))}
            <div className="review-pagination">
              <Pagination
                count={Math.ceil(commentData.length / cardsPerPage)}
                page={currentCommentPage}
                onChange={handleCommentPageChange}
                color="primary"
                size="large"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { MyReviewComment };