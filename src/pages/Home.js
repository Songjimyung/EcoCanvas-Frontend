import React from "react";
import SlideImage from "../components/slideImage/SlideImage";
import "../css/home.css"
import Indexinformation from "../components/indexinfo/Indexinformation";


const Home = () => {
  return (
    <div className="contents-body">
      <SlideImage />
      <Indexinformation />
    </div>
  );
};

export { Home };