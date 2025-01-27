import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Slider from "react-slick";
import FallbackImage from "../../assets/images/fallback-slider-image.png";
import { ReactComponent as StarIcon } from "../../assets/star-icon.svg";
import { ReactComponent as TiltedArrowIcon } from "../../assets/tilted-arrow-icon.svg";
import { ReactComponent as PlusIconBlack } from "../../assets/plus-icon-black.svg";
import { ReactComponent as PlayIcon } from "../../assets/play-icon.svg";
import { ReactComponent as PauseIcon } from "../../assets/pause-icon.svg";
import { ReactComponent as SpeakerIcon } from "../../assets/speaker-icon.svg";
import { ReactComponent as SpeakerMuteIcon } from "../../assets/speaker-mute-icon.svg";
import "./PreTrip.scss";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Play, Pause, Volume, Volume1, Volume2, VolumeX } from "lucide-react";

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

// Custom component for truncated description
const TruncatedDescription = ({ description, open, maxLength = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Reset expanded state when drawer closes
  useEffect(() => {
    if (!open) {
      setIsExpanded(false);
    }
  }, [open]);

  // If description is shorter than max length, show full description
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

const PreTrip = () => {
  const { preTrips } = useSelector((state) => state.trip);
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

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const currentTrip = preTrips[activeIndex] || {};

  const [volume, setVolume] = useState(1);

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="w-5 h-5" />;
    if (volume < 0.33) return <Volume className="w-5 h-5" />;
    if (volume < 0.66) return <Volume1 className="w-5 h-5" />;
    return <Volume2 className="w-5 h-5" />;
  };

  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(60% - ${drawerBleeding}px)`,
            overflow: "visible",
          },
        }}
      />
      <div className="slider-container">
        <Slider {...settings}>
          {preTrips.map((trip, index) => (
            <div key={index} className="slider-item px-2">
              <div className="relative overflow-hidden rounded-[20px]">
                <img
                  src={trip.image}
                  className="slider-image object-cover"
                  alt={`Temple ${index + 1}`}
                  loading="lazy"
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

                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent text-white text-base gap-2 px-3 items-center flex font-bold py-3">
                    <span className="flex-1">{trip.tripName}</span>
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
        {/* <AudioPlayer
          audioUrl={
            "
          }
          open={open}
        /> */}
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
        <StyledBox
          sx={{
            position: "absolute",
            top: -drawerBleeding,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
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
            <div className="divide-y-2 divide-dashed">
              {currentTrip.tripLocation.map((trip, index) => (
                <div key={index} className="flex flex-col py-3 gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      className="w-9 h-9 rounded-md"
                      src={trip.images.length ? trip.images[0] : FallbackImage}
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
                    <AudioPlayer
                      // autoPlay
                      src={trip.audio}
                      // src={trip.audio}
                      showSkipControls={false}
                      showJumpControls={false}
                      layout="horizontal-reverse"
                      customProgressBarSection={[
                        "CURRENT_TIME",
                        <div className="px-1 text-white">/</div>,
                        "DURATION",
                        <div className="px-2"></div>,
                        "PROGRESS_BAR",
                        "VOLUME_CONTROLS",
                      ]}
                      customControlsSection={["MAIN_CONTROLS"]}
                      customIcons={{
                        play: <PlayIcon className="w-[18px] h-[18px]" />,
                        pause: <PauseIcon className="w-[18px] h-[18px]" />,
                        volume: <SpeakerIcon className="w-[18px] h-[18px]" />,
                        volumeMute: (
                          <SpeakerMuteIcon className="w-[18px] h-[18px]" />
                        ),
                      }}
                      // onLoadStart={() => console.log("started")}
                      className="custom-player"
                      onVolumeChange={(e) => setVolume(e.target.volume)}
                      style={{
                        boxShadow: "none",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  );
};

// const AudioPlayer = React.memo(({ audioUrl, open }) => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const audioRef = useRef(null);

//   // Lazy audio loading
//   const initializeAudio = () => {
//     if (!audioRef.current) {
//       audioRef.current = new Audio(audioUrl);
//       audioRef.current.preload = "metadata";

//       audioRef.current.addEventListener("loadedmetadata", () => {
//         setDuration(audioRef.current.duration);
//       });

//       audioRef.current.addEventListener("timeupdate", () => {
//         setCurrentTime(audioRef.current.currentTime);
//       });
//     }
//   };

//   // Only initialize audio when drawer is open
//   useEffect(() => {
//     if (open) {
//       initializeAudio();
//     }
//     return () => {
//       if (audioRef.current) {
//         audioRef.current.pause();
//         audioRef.current.currentTime = 0;
//       }
//     };
//   }, [open, audioUrl]);

//   // Reset on drawer close
//   useEffect(() => {
//     if (!open && audioRef.current) {
//       audioRef.current.pause();
//       audioRef.current.currentTime = 0;
//       setIsPlaying(false);
//     }
//   }, [open]);

//   // Play/Pause handler
//   const togglePlay = () => {
//     if (!audioRef.current) return;

//     const audio = audioRef.current;

//     // Pause all other audio elements
//     document.querySelectorAll("audio").forEach((a) => {
//       if (a !== audio) a.pause();
//     });

//     if (isPlaying) {
//       audio.pause();
//     } else {
//       audio.play();
//     }
//     setIsPlaying(!isPlaying);
//   };

//   // Format time to MM:SS
//   const formatTime = (time) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
//   };

//   // Progress bar change handler
//   const handleProgressChange = (e) => {
//     if (!audioRef.current) return;
//     const audio = audioRef.current;
//     const newTime = (e.target.value / 100) * duration;
//     audio.currentTime = newTime;
//     setCurrentTime(newTime);
//   };

//   // Memoized progress calculation
//   const progressPercentage = useMemo(
//     () => (currentTime / duration) * 100 || 0,
//     [currentTime, duration]
//   );

//   return (
//     <div className="bg-[#FFB61A] rounded-lg p-2 mt-2">
//       <div className="flex items-center justify-between mb-2">
//         <button onClick={togglePlay} className="bg-white rounded-full p-1">
//           {isPlaying ? "Pause" : "PLay"}
//         </button>
//         <div className="text-white text-sm">
//           {formatTime(currentTime)} / {formatTime(duration)}
//         </div>
//       </div>
//       <input
//         type="range"
//         min="0"
//         max="100"
//         value={progressPercentage}
//         onChange={handleProgressChange}
//         className="w-full h-1 bg-white/30 rounded-full appearance-none"
//         style={{
//           background: `linear-gradient(to right, white ${progressPercentage}%, rgba(255,255,255,0.3) ${progressPercentage}%)`,
//         }}
//       />
//     </div>
//   );
// });

export default PreTrip;
