import React, { useEffect, useRef } from "react";
import "./slideImage.css";

function SlideImage() {
  const imagesRef = useRef(null);
  const images = useRef([]);

  useEffect(() => {
    let currentIndex = 0;
    const interval = 10000;

    function fadeIn(element) {
      let op = 0.1;
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
      let op = 1;
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

    images.current = Array.from(imagesRef.current.getElementsByTagName("li"));

    fadeIn(images.current[currentIndex]);
    const intervalId = setInterval(changeImage, interval);

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
