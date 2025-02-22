import { X } from "lucide-react";
import React, { useMemo, useState } from "react";
import Modal from "react-modal";
import Slider from "react-slick";
import FallbackImage from "../../assets/images/fallback-slider-image.png";

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
    padding: "60px 20px",
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

  const settings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    }),
    []
  );

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <button className="absolute top-2.5 right-[14px]" onClick={closeModal}>
          <X color="white" size={30} />
        </button>
        <Slider {...settings}>
          {images.map((image, index) => (
            <img
              src={image}
              className="h-[350px] object-cover"
              alt={`Temple ${index + 1}`}
              onError={(e) => {
                e.target.src = FallbackImage;
              }}
            />
          ))}
        </Slider>
      </Modal>
    </div>
  );
}

export default ModalComponent;
