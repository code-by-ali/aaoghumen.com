import { styled } from "@mui/material/styles";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { Plus } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { ReactComponent as CartIcon } from "../../assets/cart-icon.svg";
import FallbackImage from "../../assets/images/fallback-slider-image.png";
import { ReactComponent as PlusIconBlack } from "../../assets/plus-icon-black.svg";
import { ReactComponent as StarIcon } from "../../assets/star-icon.svg";
import { ReactComponent as StyledRightArrowIcon } from "../../assets/styled-right-arrow.svg";
import { ReactComponent as TiltedArrowIcon } from "../../assets/tilted-arrow-icon.svg";
import {
  setEmptyCart,
  setPreTripCart,
  setPreTripTime,
} from "../../redux/trip/tripSlice";
import CustomAudioPlayer from "../CustomAudioPlayer";
import { CustomModal } from "../CustomModal/index.js";
import FilterButton from "../FilterButton";
import ModalComponent from "../ModalComponent/index.js";

const drawerBleeding = 56;

const Root = styled("div")(({ theme }) => ({
  height: "100%",
}));

const StyledBox = styled("div")(({ theme }) => ({
  backgroundColor: "#fff",
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
}));

const Puller = styled("div")(({ theme }) => ({
  width: 54,
  height: 6,
  backgroundColor: "#182138",
  opacity: "0.4",
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 25px)",
}));

// Video Modal Component
const VideoModal = ({ isOpen, onClose, videoUrl }) => {
  return (
    <CustomModal
      open={isOpen}
      onClose={onClose}
      title="Demo Trip Video"
      primaryButtonText="Close"
      primaryButtonColor="primary"
      showSecondaryButton={false}
      onPrimaryAction={onClose}
    >
      <div className="px-4 py-4">
        {videoUrl ? (
          <video
            controls
            className="w-full rounded-lg"
            style={{ maxHeight: "400px" }}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <p className="text-sm text-gray-600">No video available</p>
        )}
      </div>
    </CustomModal>
  );
};

// Custom component for truncated description
export const TruncatedDescription = ({
  description = "",
  open,
  maxLength = 100,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!open) {
      setIsExpanded(false);
    }
  }, [open]);

  if (!description) {
    return (
      <p className="text-[13px]" style={{ color: "rgba(24, 33, 56, 0.6)" }}>
        No Description Available
      </p>
    );
  }

  if (description.length <= maxLength) {
    return (
      <p className="text-[13px]" style={{ color: "rgba(24, 33, 56, 0.6)" }}>
        {description}
      </p>
    );
  }

  return (
    <div>
      <p className="text-[13px]" style={{ color: "rgba(24, 33, 56, 0.6)" }}>
        {isExpanded ? description : `${description.slice(0, maxLength)}...`}
        <span
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-orange1 cursor-pointer ml-1.5 font-medium underline underline-offset-2"
        >
          {isExpanded ? "Show Less" : "Read More"}
        </span>
      </p>
    </div>
  );
};

// Time Selection Modal Component
const TimeSelectionModal = ({
  isOpen,
  onClose,
  onConfirm,
  timeOptions,
  tripName,
}) => {
  const [selectedTime, setSelectedTime] = useState("");

  const formatTime = (hour) => {
    if (hour === 0) return "12:00 AM";
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return "12:00 PM";
    return `${hour - 12}:00 PM`;
  };

  const formattedTimeOptions = timeOptions.map((hour) => ({
    value: hour,
    label: formatTime(hour),
  }));

  useEffect(() => {
    if (isOpen) {
      setSelectedTime("");
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (selectedTime !== "") {
      onConfirm(selectedTime);
      onClose();
    }
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  return (
    <CustomModal
      open={isOpen}
      onClose={onClose}
      title="Select Trip Start Time"
      primaryButtonText="Add to Cart"
      primaryButtonColor="primary"
      onPrimaryAction={handleConfirm}
      primaryButtonDisabled={selectedTime === ""}
    >
      <div className="px-4 py-2">
        <p className="text-sm text-gray-600 mb-4">This trip will start from:</p>
        <FormControl fullWidth>
          <InputLabel id="time-select-label">Select Start Time</InputLabel>
          <Select
            labelId="time-select-label"
            id="time-label-select"
            value={selectedTime}
            onChange={handleTimeChange}
            label="Select start time"
          >
            {formattedTimeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </CustomModal>
  );
};

const PreTrip = () => {
  const { preTrips, cart, generatedTrip } = useSelector((state) => state.trip);
  const { demoTrip } = useSelector((state) => state.content.contentData);
  const { data } = generatedTrip;
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [videoModalIsOpen, setVideoModalIsOpen] = useState(false); // New state for video modal
  const [images, setImages] = useState([]);
  const [open, setOpen] = useState(false);
  const [isAddTripDialogOpen, setIsAddTripDialogOpen] = useState(false);
  const [isTimeSelectionOpen, setIsTimeSelectionOpen] = useState(false);
  const [selectedTripForTime, setSelectedTripForTime] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedTrips, selectedCategory } = cart;

  const settings = useMemo(
    () => ({
      className: "center",
      centerMode: true,
      arrows: false,
      infinite: false,
      centerPadding: "60px",
      slidesToShow: 1,
      focusOnSelect: false,
      afterChange: (current) => setActiveIndex(current),
    }),
    []
  );

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const currentTrip = preTrips[activeIndex] || {};

  function handleAddTrip(trip) {
    if (
      trip.tripLocation &&
      trip.tripLocation[0] &&
      trip.tripLocation[0].tripTiming &&
      trip.tripLocation[0].tripTiming.length > 0
    ) {
      setSelectedTripForTime(trip);
      setIsTimeSelectionOpen(true);
    } else {
      proceedWithAddTrip(trip);
    }
  }

  function proceedWithAddTrip(trip, selectedStartTime = null) {
    const tripWithTime = selectedStartTime
      ? { ...trip, selectedStartTime }
      : trip;

    if (selectedCategory === "planTrip" && selectedTrips.length) {
      setIsAddTripDialogOpen(true);
    } else {
      dispatch(setPreTripCart([tripWithTime]));
      dispatch(setPreTripTime(selectedStartTime));
      navigate("/cart");
    }
  }

  function handleTimeSelection(selectedTime) {
    if (selectedTripForTime) {
      proceedWithAddTrip(selectedTripForTime, selectedTime);
      setSelectedTripForTime(null);
    }
  }

  function handleOpenModal(trip) {
    let images = [];
    if (trip.tripLocation && Array.isArray(trip.tripLocation)) {
      trip.tripLocation.forEach((location) => {
        if (location.images && Array.isArray(location.images)) {
          images = images.concat(location.images);
        }
      });
    }
    setImages(images);
    setModalIsOpen(true);
  }

  // Function to handle opening the video modal
  function handleOpenVideoModal() {
    if (demoTrip) {
      setVideoModalIsOpen(true);
    }
  }

  return (
    <>
      <FilterButton hidePlaces={true} />
      <ModalComponent
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        images={images}
        setImages={setImages}
      />
      {/* Video Modal */}
      <VideoModal
        isOpen={videoModalIsOpen}
        onClose={() => setVideoModalIsOpen(false)}
        videoUrl={demoTrip}
      />
      <TimeSelectionModal
        isOpen={isTimeSelectionOpen}
        onClose={() => {
          setIsTimeSelectionOpen(false);
          setSelectedTripForTime(null);
        }}
        onConfirm={handleTimeSelection}
        timeOptions={selectedTripForTime?.tripLocation?.[0]?.tripTiming || []}
        tripName={selectedTripForTime?.tripName || ""}
      />
      <CustomModal
        open={isAddTripDialogOpen}
        onClose={() => setIsAddTripDialogOpen(false)}
        title="Want to Add this Trip ?"
        description="Note: You have already added a trip in the cart from Plan you Trip Tab which will be lost by adding this trip. Are you sure you want to add this trip?"
        primaryButtonText="Yes, Proceed"
        primaryButtonColor="primary"
        onPrimaryAction={() => {
          dispatch(setEmptyCart());
          const tripToAdd =
            selectedTripForTime && currentTrip.selectedStartTime
              ? {
                  ...currentTrip,
                  selectedStartTime: currentTrip.selectedStartTime,
                }
              : currentTrip;
          dispatch(setPreTripCart([tripToAdd]));
          navigate("/cart");
        }}
      />
      <Root>
        <div className="slider-container">
          <Slider {...settings}>
            {preTrips.map((trip, index) => (
              <div key={index} className="slider-item px-2">
                <div className="relative overflow-hidden rounded-[20px]">
                  <img
                    src={trip.image}
                    className="slider-image object-cover"
                    alt={`Temple ${index + 1}`}
                    onError={(e) => {
                      e.target.src = FallbackImage;
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col justify-between">
                    <span
                      className="absolute top-3 left-3 bg-[#FFB61A] text-white 
                text-[14px] font-medium w-[46px] flex items-center justify-center py-0.5 rounded-md"
                    >
                      <StarIcon className="mr-1.5" /> {trip.tripRating}
                    </span>
                    <span
                      className="absolute top-3 right-3 bg-white text-black1 
                text-[14px] font-medium h-7 w-7 flex items-center justify-center rounded-full cursor-pointer"
                      onClick={() => {
                        handleOpenModal(trip);
                      }}
                    >
                      <StyledRightArrowIcon className="h-3.5 w-3.5" />
                    </span>
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent text-white text-base gap-2 px-3 items-center flex font-bold py-3">
                      <span className="flex-1">{trip.tripName}</span>
                      <TiltedArrowIcon
                        className="h-3 w-3 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpen(true);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
          <div className="w-full inline-flex justify-center mt-2">
            {cart.selectedCategory === "preTrip" &&
            cart.selectedTrips.length > 0 ? (
              <button
                className="text-white inline-flex gap-2 px-2.5 py-1.5 justify-center items-center bg-orange1 rounded-md font-semibold text-[15px]"
                onClick={() => navigate("/cart")}
              >
                <CartIcon className="h-5 w-5 stroke-[3px]" /> View Cart
                <TiltedArrowIcon className="h-2.5 w-2.5" />
              </button>
            ) : Object.keys(data).length > 0 ? (
              <button
                className="text-white inline-flex gap-2 px-2.5 py-1.5 justify-center items-center bg-orange1 rounded-md font-semibold text-[15px]"
                onClick={() => navigate("/trip-generate")}
              >
                <CartIcon className="h-5 w-5 stroke-[3px]" /> View Generated
                Trip
                <TiltedArrowIcon className="h-2.5 w-2.5" />
              </button>
            ) : (
              <button
                className="text-white inline-flex gap-2 px-2.5 py-1.5 justify-center items-center bg-orange1 rounded-md font-semibold text-[15px]"
                onClick={() => handleAddTrip(currentTrip)}
              >
                <Plus className="h-5 w-5 stroke-[3px]" /> Add to Cart
              </button>
            )}
          </div>
        </div>
        <SwipeableDrawer
          anchor="bottom"
          open={open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          swipeAreaWidth={drawerBleeding}
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <div className="trip-content">
            <StyledBox
              sx={{
                position: "absolute",
                top: -drawerBleeding,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                visibility: "visible",
                right: 0,
                left: 0,
                maxWidth: "430px",
                margin: "auto",
                fontFamily: "Public Sans, serif",
              }}
              className="border-t-2"
            >
              {open && (
                <div
                  className="absolute cursor-pointer bg-white flex items-center justify-center h-9 w-9 rounded-full"
                  onClick={() => setOpen(false)}
                  style={{ top: "-48px", left: "calc(50% - 17px)" }}
                >
                  <PlusIconBlack className="rotate-45" />
                </div>
              )}
              <Puller />
              <div className="h-full" onClick={() => setOpen(true)}>
                <div className="flex mt-[17px] px-3 gap-2 justify-between items-center">
                  <span className="font-bold text-black1 text-[19px] tracking-wide">
                    {currentTrip.tripName}
                  </span>
                  <span
                    className=" bg-[#FFB61A] text-white 
                text-[14px] font-medium w-[46px] flex items-center justify-center py-0.5 rounded-md"
                  >
                    <StarIcon className="mr-1.5" /> {currentTrip.tripRating}
                  </span>
                </div>
                <p className="m-[9px]"></p>
              </div>
            </StyledBox>
          </div>
          <StyledBox
            sx={{
              height: "100%",
              overflow: "auto",
              maxWidth: "430px",
              fontFamily: "Public Sans, serif",
            }}
          >
            <div className="px-3">
              <p
                className="text-sm font-medium mb-3"
                style={{ color: "rgba(24, 33, 56, 0.6)" }}
              >
                {currentTrip.tripShortDesc}
              </p>
              <hr color="#B3B8D6" />
              <div className="divide-y-2 divide-dashed mb-4">
                {currentTrip.tripLocation?.map((trip, index) => (
                  <div key={index} className="flex flex-col py-3 gap-2">
                    <div className="flex items-center gap-3">
                      <img
                        className="w-9 h-9 rounded-md"
                        src={
                          trip.images?.length ? trip.images[0] : FallbackImage
                        }
                        alt=""
                        onError={(e) => {
                          e.target.src = FallbackImage;
                        }}
                      />
                      <p className="font-semibold tracking-wide text-lg">
                        {trip.locationName}
                      </p>
                    </div>
                    <TruncatedDescription
                      description={trip.locationDesc}
                      open={open}
                    />
                    {trip.audio && (
                      <div className="w-3/4">
                        <CustomAudioPlayer audioUrl={trip.audio} />
                      </div>
                    )}
                  </div>
                ))}
                <div className="w-full flex justify-center items-center py-3 border-t-[1px] border-dashed">
                  <button
                    className="text-orange1 font-semibold border border-orange1 rounded-xl h-12 flex items-center justify-center w-3/5"
                    onClick={handleOpenVideoModal}
                    disabled={!demoTrip} // Disable button if no video URL
                  >
                    Demo Trip
                  </button>
                </div>
              </div>
            </div>
          </StyledBox>
        </SwipeableDrawer>
      </Root>
    </>
  );
};

export default React.memo(PreTrip);
