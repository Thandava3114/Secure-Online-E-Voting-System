import React from "react";
import { Carousel } from "react-bootstrap";
import picture5 from '../assets/images/picture5.png'
import picture3 from "../assets/images/picture3.jpeg";
import pic11 from "../assets/images/pic11.jpg";

const ImageCarousel = () => {
  return (
    <div className="container-fluid vh-95 w-100 p-0">
      <Carousel interval={2000} pause="hover">  {/* 2000ms = 2 seconds */}
        <Carousel.Item>
          <img
            className="d-block w-100 "
            src={pic11}
            alt="First slide"
            style={{ height: "600px"}}
          />
        </Carousel.Item>
        
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={picture5}
            alt="Second slide"
            style={{ height: "600px" }}
          />
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src={picture3}
            alt="Third slide"
            style={{ height: "600px" }}
          />
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
