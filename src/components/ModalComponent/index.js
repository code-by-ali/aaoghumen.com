import { X } from "lucide-react";
import React, { useState } from "react";
import Modal from "react-modal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Zoom } from "swiper/modules";
import FallbackImage from "../../assets/images/fallback-slider-image.png";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "500px",
    width: "95%",
    background: "transparent",
    padding: "60px 4px",
    border: "none",
    overflow: "hidden",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 99999,
    maxWidth: "430px",
    margin: "auto",
  },
};

function ModalComponent({ modalIsOpen, setModalIsOpen, images, setImages }) {
  const closeModal = () => {
    setModalIsOpen(false);
    setImages([]);
  };

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <button className="absolute top-2.5 -right-[3px]" onClick={closeModal}>
          <X color="white" size={30} />
        </button>

        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={10}
          slidesPerView={1}
          speed={500}
          loop={true}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={image}
                className="h-[350px] w-full object-cover rounded-xl"
                alt={`Temple ${index + 1}`}
                onError={(e) => {
                  e.target.src = FallbackImage;
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Modal>
    </div>
  );
}

export default ModalComponent;
