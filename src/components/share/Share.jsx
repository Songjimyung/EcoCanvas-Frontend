import React from "react";
import sharekakao from "../../img/sharekakao.webp";
import "./share.css";

// share
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";
import { CopyToClipboard } from "react-copy-to-clipboard";

const Share = (props) => {
  const { id, type } = props;

  const generateUrl = (id) => {
    return `${process.env.REACT_APP_FRONTEND_URL}/${type}/${id}`;
  };

  function handleKakaoButton(id) {
    if (window.Kakao && window.Kakao.Link) {
      window.Kakao.Link.sendScrap({
        requestUrl: generateUrl(id),
      });
    }
  }

  return (
    <>
      <div className="modalMent">
        {type === "campaign" ? "EcoCanvas의 캠페인" : "EcoCanvas의 상품"}을
        공유해보세요.
      </div>
      <div className="shareBtnContainer">
        <CopyToClipboard
          text={generateUrl(id)}
          style={{
            marginRight: "10px",
          }}
        >
          <button className="shareUrlBtn" onClick={() => alert("복사 완료!")}>
            URL
          </button>
        </CopyToClipboard>
        <FacebookShareButton url={generateUrl(id)} className="shareBtn">
          <FacebookIcon size={48} round={true} borderRadius={24}></FacebookIcon>
        </FacebookShareButton>
        <TwitterShareButton url={generateUrl(id)} className="shareBtn">
          <TwitterIcon size={48} round={true} borderRadius={24}></TwitterIcon>
        </TwitterShareButton>
        <button
          className="shareKakaoBtn"
          style={{
            padding: "0",
            backgroundColor: "transparent",
          }}
          onClick={() => handleKakaoButton(id)}
        >
          <img
            src={sharekakao}
            alt="kakaoShareButton"
            className="shareKakaoBtn"
          />
        </button>
      </div>
    </>
  );
};
export default Share;
