import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { SwipeableDrawer, IconButton } from "@mui/material";
import FallbackImage from "../../assets/images/fallback-slider-image.png";
import { ReactComponent as StarIcon } from "../../assets/star-icon.svg";
import { ReactComponent as TiltedArrowIcon } from "../../assets/tilted-arrow-icon.svg";
import { ReactComponent as CartIcon } from "../../assets/cart-icon.svg";
import { ReactComponent as PlusIcon } from "../../assets/plus-icon-black.svg";
import { ReactComponent as CarIcon } from "../../assets/car-icon.svg";
import { ReactComponent as ClockIcon } from "../../assets/clock-icon.svg";
import CustomAudioPlayer from "../CustomAudioPlayer";
import { Check, Minus, Plus } from "lucide-react";
import FilterButton from "../FilterButton";
import {
  setEmptyCart,
  setPlanTripCart,
  setTripRemove,
} from "../../redux/trip/tripSlice";
import { useNavigate } from "react-router-dom";
import { se } from "date-fns/locale";
import { toast } from "react-toastify";
import { CustomModal } from "../CustomModal.js";

const PlanTrip = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { planTrips, cart, generatedTrip } = useSelector((state) => state.trip);
  const { data } = generatedTrip;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAddTripDialogOpen, setIsAddTripDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
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

  const currentTrip = planTrips[activeIndex] || {};

  function handleAddTrip(trip) {
    if (selectedCategory !== "preTrip") {
      const isDuplicate = selectedTrips.find((obj) => obj.code === trip.code);
      if (isDuplicate === undefined) {
        dispatch(setPlanTripCart(trip));
      } else {
        toast.error(trip.name + " is already added in the cart");
      }
    } else {
      setIsAddTripDialogOpen(true);
    }
  }

  return (
    <>
      <FilterButton />
      <CustomModal
        open={isAddTripDialogOpen}
        onClose={() => setIsAddTripDialogOpen(false)}
        title="Want to Add this Trip ?"
        description="Note: You have already added a trip in the cart from Existing Packages which will be lost by adding this trip. Are you sure you want to add this trip?"
        primaryButtonText="Yes, Proceed"
        primaryButtonColor="primary"
        onPrimaryAction={() => {
          dispatch(setEmptyCart());
          dispatch(setPlanTripCart(currentTrip));
        }}
      />
      <div className="h-full relative pb-4">
        <div className="slider-container">
          <Slider {...settings}>
            {planTrips.map((trip, index) => {
              const isAddedToCart = selectedTrips.some(
                (selectedTrip) => selectedTrip.code === trip.code
              );

              return (
                <div key={index} className="slider-item px-2">
                  <div className="relative overflow-hidden rounded-[20px]">
                    <img
                      src={trip.image.length ? trip.image[0] : FallbackImage}
                      className="slider-image object-cover"
                      alt={`Temple ${index + 1}`}
                      onError={(e) => {
                        e.target.src = FallbackImage;
                      }}
                    />
                    <div className="absolute inset-0 flex flex-col justify-between">
                      <span className="absolute top-3 left-3 bg-[#FFB61A] text-white text-[14px] font-medium w-[46px] flex items-center justify-center py-0.5 rounded-md">
                        <StarIcon className="mr-1.5" /> {trip.rating}
                      </span>
                      {isAddedToCart && (
                        <span className="absolute top-3 right-3 bg-black1 bg-opacity-40 text-white text-xs px-2 py-1 rounded-md inline-flex items-center gap-1 font-semibold">
                          <Check className="h-4 w-4 stroke-[3px]" />
                          Added to Cart
                        </span>
                      )}
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent text-white text-base gap-2 px-3 items-center flex font-bold py-3">
                        <span className="flex-1">{trip.name}</span>
                        <TiltedArrowIcon
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setOpen(true)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
          {Object.keys(data).length > 0 ? (
            <div className="w-full inline-flex justify-center mt-2">
              <button
                className="text-white inline-flex gap-2 px-2.5 py-1.5 justify-center items-center bg-orange1 rounded-md font-semibold text-[15px]"
                onClick={() => navigate("/trip-generate")}
              >
                <CartIcon className="h-5 w-5 stroke-[3px]" /> View Generated
                Trip
                <TiltedArrowIcon className="h-2.5 w-2.5" />
              </button>
            </div>
          ) : (
            <div className="flex w-full py-2 gap-2 justify-center">
              {selectedTrips.some(
                (selectedTrip) => selectedTrip.code === currentTrip.code
              ) && (
                <button
                  className="inline-flex justify-center items-center h-[46px] w-[46px] bg-black1 rounded-full text-white outline-none border-none"
                  onClick={() => dispatch(setTripRemove(currentTrip.code))}
                >
                  <Minus className="h-6 w-6 stroke-[3px]" />
                </button>
              )}
              {selectedTrips.length && selectedCategory === "planTrip" ? (
                <div className="inline-flex justify-center items-center h-[46px] w-[46px] bg-orange1 rounded-full text-white text-[22px] font-bold">
                  {selectedTrips.length}
                </div>
              ) : (
                <></>
              )}
              <button
                className="inline-flex justify-center items-center h-[46px] w-[46px] bg-black1 rounded-full text-white outline-none border-none"
                onClick={() => handleAddTrip(currentTrip)}
              >
                <Plus className="h-6 w-6 stroke-[3px]" />
              </button>
            </div>
          )}
        </div>

        {/* Swipeable MUI Bottom Drawer */}
        <SwipeableDrawer
          anchor="bottom"
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          swipeAreaWidth={50}
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: {
              height: "70%", // Changed to 70% of viewport height
              maxWidth: "430px",
              margin: "0 auto",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
              width: "100%",
            },
          }}
        >
          <div className="h-full flex flex-col">
            {/* Handle bar */}
            <div className="px-6 pt-6 flex justify-center mb-2 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>
            {/* Close button */}
            <IconButton
              onClick={() => setOpen(false)}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
              }}
            >
              <PlusIcon className="rotate-45" />
            </IconButton>
            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-3.5 flex justify-between items-center pb-2 mt-4 border-b border-[#B3B8D6] gap-2">
                <span className="text-[20px] tracking-wide text-orange1 font-semibold">
                  {currentTrip.name}
                </span>
                <div className="inline-flex items-center gap-1">
                  <CarIcon className="h-3.5 w-3.5" />
                  <span className="font-medium text-black1 text-opacity-70 text-xs whitespace-nowrap">
                    {currentTrip.time} mins
                  </span>
                </div>
              </div>
              <div className="flex flex-col w-full px-3.5 py-3 text-[15px] font-medium">
                <div className="flex flex-col gap-1">
                  <div className="inline-flex justify-between items-center">
                    <div className="inline-flex items-center gap-1">
                      <ClockIcon />{" "}
                      <span className="text-black1 text-opacity-60">
                        Timing - ({currentTrip.openTime} -{" "}
                        {currentTrip.closeTime})
                      </span>
                    </div>
                    <div className="bg-[#17942B] min-w-[38px] px-1.5 h-[22px] justify-center gap-1 rounded inline-flex items-center text-white text-xs">
                      <StarIcon className="mb-0.5" /> {currentTrip.rating}
                    </div>
                  </div>
                  <p className="text-[#17942B]">
                    Break timing - ({currentTrip.breckOpenTime} -{" "}
                    {currentTrip.breckCloseTime})
                  </p>
                  <div className="w-3/4 mt-2">
                    <CustomAudioPlayer audioUrl={currentTrip.audio} />
                  </div>
                  <p className="text-black1 text-opacity-60 mt-2">
                    {currentTrip.desc || "No description is available!"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SwipeableDrawer>

        {/* Fixed button at bottom */}
        <div
          className={`fixed bottom-0 left-0 right-0 bg-orange1 max-w-[430px] mx-auto flex items-center justify-center font-semibold text-white h-14 text-[17px] gap-2 underline underline-offset-2 z-[9999] ${
            cart.selectedTrips?.length === 0 ? "bg-opacity-50" : ""
          }`}
          onClick={() => navigate("/cart")}
        >
          <CartIcon className="h-6 w-6" /> View Cart{" "}
          <TiltedArrowIcon className="h-3 w-3" />
        </div>
      </div>
    </>
  );
};

export default PlanTrip;
