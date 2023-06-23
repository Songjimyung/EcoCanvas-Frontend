import { useState, useEffect } from "react";

function UseScript(src) {
  // Keep track of script status ("idle", "loading", "ready", "error")
  const [status, setStatus] = useState(src ? "loading" : "idle");

  useEffect(() => {
    // Allow falsy src value if waiting on other data needed for
    // constructing the script URL passed to this hook.
    if (!src) {
      setStatus("idle");
      return;
    }

    // Fetch existing script element by src
    // It may have been added by another instance of this hook
    let script = document.querySelector(`script[src="${src}"]`);

    if (!script) {
      // Create script
      script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.setAttribute("data-status", "loading");
      // Add script to document body
      document.body.appendChild(script);

      // Store status in attribute on script
      // This can be read by other instances of this hook
      const setAttributeFromEvent = (event) => {
        script.setAttribute(
          "data-status",
          event.type === "load" ? "ready" : "error"
        );
      };

      script.addEventListener("load", setAttributeFromEvent);
      script.addEventListener("error", setAttributeFromEvent);
    } else {
      // Grab existing script status from attribute and set to state.
      setStatus(script.getAttribute("data-status"));
    }

    // Script event handler to update status in state
    // Note: Even if the script already exists we still need to add
    // event handlers to update the state for *this* hook instance.
    const setStateFromEvent = (event) => {
      setStatus(event.type === "load" ? "ready" : "error");
    };

    // Add event listeners
    script.addEventListener("load", setStateFromEvent);
    script.addEventListener("error", setStateFromEvent);

    // Remove event listeners on cleanup
    return () => {
      if (script) {
        script.removeEventListener("load", setStateFromEvent);
        script.removeEventListener("error", setStateFromEvent);
      }
    };
  }, [src]); // Only re-run effect if script src changes

  return status;
}

function KakaoInit() {
  const status = UseScript("https://developers.kakao.com/sdk/js/kakao.js");

  useEffect(() => {
    
    
    if (status === "ready") {
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
  }, [status]);

  // Render loading state or other components based on status if needed

  return null;
}

const generateCampaignUrl = (campaignId) => {
  
  return `${process.env.REACT_APP_FRONTEND_URL}/campaign/${campaignId}`;
};

function handleKakaoButton(campaignId) {
  
  if (window.Kakao && window.Kakao.Link) {
    window.Kakao.Link.sendScrap({
      requestUrl: generateCampaignUrl(campaignId),
    });
  }
}

export { KakaoInit, handleKakaoButton };