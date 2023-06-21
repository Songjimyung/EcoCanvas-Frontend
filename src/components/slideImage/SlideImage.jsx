// import React, { useState, useEffect } from 'react';
// import './slideImage.css';

// function SlideImage() {
//   const [marginLeft, setMarginLeft] = useState('0px');

//   useEffect(() => {
//     const slideInterval = setInterval(() => {
//       setMarginLeft('-1200px');
//       setTimeout(() => {
//         setMarginLeft('0px');
//         const slideul = document.querySelector('.slideul');
//         slideul.appendChild(slideul.firstElementChild);
//       }, 80);
//     }, 10000);

//     // 컴포넌트가 unmount될 때 interval 정리
//     return () => clearInterval(slideInterval);
//   }, []);

//   return (
//     <section className="slide">
//       <ul className="slideul" style={{ marginLeft: marginLeft }}>
//         <li className="slide1"></li>
//         <li className="slide2"></li>
//         <li className="slide3"></li>
//       </ul>
//     </section>
//   );
// }

import React, { useEffect, useRef } from "react";
import "./slideImage.css";

function SlideImage() {
  const imagesRef = useRef(null);
  const images = useRef([]);

  useEffect(() => {
    let currentIndex = 0;
    const interval = 10000; // 이미지 전환 간격 (10초)

    function fadeIn(element) {
      let op = 0.1; // 초기 투명도 값
      element.style.display = "block";
      const timer = setInterval(() => {
        if (op >= 1) {
          clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = `alpha(opacity=${op * 100})`;
        op += op * 0.1;
      }, 10);
    }

    function fadeOut(element) {
      let op = 1; // 초기 투명도 값
      const timer = setInterval(() => {
        if (op <= 0.1) {
          clearInterval(timer);
          element.style.display = "none";
        }
        element.style.opacity = op;
        element.style.filter = `alpha(opacity=${op * 100})`;
        op -= op * 0.1;
      }, 10);
    }

    function changeImage() {
      const currentImage = images.current[currentIndex];
      fadeOut(currentImage);
      currentIndex = (currentIndex + 1) % images.current.length;
      const nextImage = images.current[currentIndex];
      fadeIn(nextImage);
    }

    // 이미지 노드 참조 설정
    images.current = Array.from(imagesRef.current.getElementsByTagName("li"));

    fadeIn(images.current[currentIndex]); // 첫 번째 이미지 보이기
    const intervalId = setInterval(changeImage, interval); // 일정 시간마다 이미지 전환

    // 컴포넌트 언마운트 시 setInterval 정리
    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="slide">
      <ul ref={imagesRef} id="slide-ul">
        <li id="slide1"></li>
        <li id="slide2"></li>
        <li id="slide3"></li>
      </ul>
    </section>
  );
}

export default SlideImage;
