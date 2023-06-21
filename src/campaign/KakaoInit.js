import { UseScript } from "./Kakaohooks";
import { useEffect } from "react";

const KakaoInit = () => {
  useEffect(() => {
    const initializeKakaoSDK = async () => {
      // kakao SDK import하기
      const status = UseScript("https://developers.kakao.com/sdk/js/kakao.js");

      // kakao sdk 초기화하기
      // status가 변경될 때마다 실행되며, status가 ready일 때 초기화를 시도합니다.
      if (status === "ready" && window.Kakao) {
        // 중복 initialization 방지
        if (!window.Kakao.isInitialized()) {
          // 두번째 step 에서 가져온 javascript key 를 이용하여 initialize
          window.Kakao.init(`${process.env.REACT_APP_KAKAOSHARE_KEY}`);
        }
      }
    };

    initializeKakaoSDK();
  }, []);

  return null;
};

export default KakaoInit;
