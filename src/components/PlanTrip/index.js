import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
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
import { Check, Plus } from "lucide-react";
import FilterButton from "../FilterButton";

const PlanTrip = () => {
  const { planTrips, cart } = useSelector((state) => state.trip);
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);

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

  return (
    <>
      <FilterButton />
      <div className="h-full relative pb-4">
        <div className="slider-container">
          <Slider {...settings}>
            {planTrips.map((trip, index) => (
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
            ))}
          </Slider>
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
                  <div className="flex justify-center mt-2 p-3 border-t border-dashed border-[#B3B8D6] w-full">
                    <button className="text-white inline-flex gap-1 px-2 py-1.5 justify-center items-center bg-orange1 rounded-md">
                      <Plus className="h-5 w-5 stroke-[3px]" /> Add to Cart
                    </button>
                    <button className="text-white inline-flex gap-1 px-2 py-1.5 justify-center items-center bg-orange1 rounded-md">
                      <Check className="h-5 w-5 stroke-[3px]" /> Added to Cart
                    </button>
                  </div>
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
        >
          <CartIcon className="h-6 w-6" /> View Cart{" "}
          <TiltedArrowIcon className="h-3 w-3" />
        </div>
      </div>
    </>
  );
};

export default PlanTrip;
