import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./indexinformation.css";
import fornature from "../../img/fornature.jpg";
import imnottrash from "../../img/imnottrash.jpg";
import campaign_index from "../../img/campaign_index.jpg";
import { Button } from "@mui/material";

export default function Indexinformation() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleClick = (page) => {
    navigate(`/${page}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <>
      <div className="index-container">
        <div className="index-wrap">
          <div className="index-text">
            <p className="index-h2">EcoCanvas와 환경을 지켜주세요.</p>
            <p className="index-content">
              당신의 목소리로 환경을 변화시켜보세요. EcoCanvas에서는 직접 환경
              캠페인을 주최해 사회에 대한 환경보호를 독려할 수 있습니다.{" "}
              <span id="earthday" onClick={() => handleClick("campaign")}>
                지구의 날
              </span>
              을 통해 사회를 변화시키고, 환경 문제에 대한 인식을 높여주세요.
            </p>
          </div>
          <div className="index-image">
            <img src={fornature} alt="world-environment-day" />
          </div>
        </div>
        <div className="index-wrap">
          <div className="index-image">
            <img src={campaign_index} alt="ecocampaign" />
          </div>
          <div className="index-text">
            <p className="index-h2">작은 기부로 큰 변화를 만들어보세요.</p>
            <p className="index-content">
              EcoCanvas에서는 환경 캠페인 펀딩을 통해 자금을 모으고 기부할 수
              있는 기회를 제공합니다. 펀딩 플랫폼을 통해 캠페인에 참여하고
              지구의 미래를 위한 기부에 동참해 보세요. 작은 기부로도 큰 변화를
              이룰 수 있습니다.
            </p>
          </div>
        </div>
        <div className="index-wrap">
          <div className="index-text">
            <p className="index-h2">환경과 스타일을 동시에 챙겨보세요.</p>
            <p className="index-content">
              EcoCanvas는 소비자와 함께 소중한 자원을 보호하고 더욱 건강한
              환경을 만들어 갑니다. 지속 가능하고 우수한 친환경 상품을 많이
              알려드리고 제품의 생산부터 폐기의 전 과정을 섬세히 검토하여 가치
              있는 소비를 할 수 있도록 힘씁니다. <br />
              지구를 사랑하는 마음으로 지속 가능한 제품을 선택해 보세요.
            </p>
            <Button
              variant="contained"
              color="primary"
              sx={{
                height: "50px",
                fontSize: "1.3rem",
                color: "white",
                marginTop: "30px",
              }}
              onClick={() => handleClick("shop")}
            >
              전체제품 보기
            </Button>
          </div>
          <div className="index-image">
            <img src={imnottrash} alt="shop" />
          </div>
        </div>
      </div>
    </>
  );
}
