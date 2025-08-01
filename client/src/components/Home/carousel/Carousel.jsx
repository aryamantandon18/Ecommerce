import React, { useEffect, useRef } from "react";
import "./carousel.css"; 
import flight from "../../../assets/images/Banners/flight.jpeg";
import flight2 from "../../../assets/images/Banners/flight2.jpeg";
import laptop from "../../../assets/images/Banners/laptop.png";
import mattress from "../../../assets/images/Banners/mattress.jpg";
import iphone from "../../../assets/images/Banners/iphone.jpg";

const images = [flight, flight2, laptop, mattress, iphone];

const Carousel = () => {
  const listRef = useRef(null);
  const carouselRef = useRef(null);
  const runningTimeRef = useRef(null);
  const nextBtnRef = useRef(null);
  const prevBtnRef = useRef(null);

  const timeRunning = 3000;
  const timeAutoNext = 4000;

  const runTimeOut = useRef(null);
  const runNextAuto = useRef(null);

  useEffect(() => {
    runNextAuto.current = setTimeout(() => {
      if (nextBtnRef.current) {
        nextBtnRef.current.click();
      }
    }, timeAutoNext);

    return () => {
      clearTimeout(runNextAuto.current);
      clearTimeout(runTimeOut.current);
    };
  }, []);

  const resetTimeAnimation = () => {
    if (runningTimeRef.current) {
      runningTimeRef.current.style.animation = "none";
      void runningTimeRef.current.offsetHeight; // Force reflow
      runningTimeRef.current.style.animation = "runningTime 7s linear 1 forwards";
    }
  };

  const showSlider = (type) => {
    if (!listRef.current || !carouselRef.current) return;

    const sliderItems = listRef.current.querySelectorAll(".item");
    if (sliderItems.length === 0) return;

    if (type === "next") {
      listRef.current.appendChild(sliderItems[0]); // Move first item to the end
      carouselRef.current.classList.add("next");
    } else {
      listRef.current.prepend(sliderItems[sliderItems.length - 1]); // Move last item to the front
      carouselRef.current.classList.add("prev");
    }

    clearTimeout(runTimeOut.current);
    runTimeOut.current = setTimeout(() => {
      carouselRef.current.classList.remove("next");
      carouselRef.current.classList.remove("prev");
    }, timeRunning);

    clearTimeout(runNextAuto.current);
    runNextAuto.current = setTimeout(() => {
      if (nextBtnRef.current) {
        nextBtnRef.current.click();
      }
    }, timeAutoNext);

    resetTimeAnimation();
  };

  return (
    <div className="carousel" ref={carouselRef}>
      <div className="list" ref={listRef}>
        {images.map((image, index) => (
          <div key={index} className="item" style={{ backgroundImage: `url(${image})` }}>
            <div className="content">
              <h2 className="title">Title {index + 1}</h2>
              <p className="des">Description {index + 1}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="arrows">
        <button ref={prevBtnRef} className="prev" onClick={() => showSlider("prev")}>
          &lt;
        </button>
        <button ref={nextBtnRef} className="next" onClick={() => showSlider("next")}>
          &gt;
        </button>
      </div>

      <div className="timeRunning" ref={runningTimeRef}></div>
    </div>
  );
};

export default Carousel;
