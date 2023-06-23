import React from "react";
import { CallbackKakao } from "./kakaocallback";


const KakaoRedirect = (props) => {
  let code = new URL(window.location.href).searchParams.get("code");

  return <CallbackKakao code={code} />;
};

export { KakaoRedirect };
