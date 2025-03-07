import { Box, SwipeableDrawer } from "@mui/material";
import { differenceInMinutes, format, isSameDay, parse } from "date-fns";
import { saveAs } from "file-saver";
import { ArrowUp, CircleX, FileDown, Home, LoaderCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ReactComponent as PersonIcon } from "../../assets/person-icon.svg";
import { ReactComponent as PinBaseIcon } from "../../assets/pin-base-icon.svg";
import { ReactComponent as PinIcon } from "../../assets/pin-icon.svg";
import { ReactComponent as TitledArrow } from "../../assets/tilted-arrow-icon.svg";
import { ReactComponent as ViewTimelineIcon } from "../../assets/view-timeline-icon.svg";
import CircularAudioPlayer from "../../components/CircularAudioPlayer/index.js";
import { CustomModal } from "../../components/CustomModal";
import { TruncatedDescription } from "../../components/PreTrip";
import {
  setEmptyGeneratedTrip,
  setGeneratedTripData,
} from "../../redux/trip/tripSlice";
import apiService from "../../services/api/apiServices";

const TripGenerate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [tripFailed, setTripFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { selectedFilters } = useSelector((state) => state.filter);
  const { city } = useSelector((state) => state.onboarding);
  const { contentData } = useSelector((state) => state.content);
  const [drawerHeight, setDrawerHeight] = useState("55%");
  const { selectedTrips, dropLocation, data, generatedAt, paymentId } =
    useSelector((state) => state.trip.generatedTrip);

  useEffect(() => {
    const currentDate = new Date();
    const tripDate = new Date(generatedAt);
    if (selectedTrips.length === 0) {
      toast.error("No Trip Data Available");
      navigate("/home");
      return;
    }
    if (!isSameDay(tripDate, currentDate)) {
      toast.error("Generated Trip is Expired");
      navigate("/home");
      return;
    }
    fetchData();
    setIsDrawerOpen(true);
  }, []);

  useEffect(() => {
    // Disable back button
    const handleBackButton = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const body = {
        cityName: city?.cityName,
        language: selectedFilters?.Languages.code,
        hours: String(selectedFilters["Traveling Time"].code),
        currentLocation: selectedFilters["Current Location"].code,
        tripLocations: selectedTrips.join(","),
        mobile: localStorage.getItem("verified-mobile"),
        dropOffLocation: dropLocation,
        paymentId,
      };

      const response = await apiService.getGeneratedTrip(body);
      if (response.statusCode === 200 && response.data.length) {
        dispatch(setGeneratedTripData(response.data[0]));
        setIsDrawerOpen(true); // Open drawer by default when data loads
        setTripFailed(false);
        setErrorMessage("");
      } else {
        setIsDrawerOpen(false);
        setTripFailed(true);
        setErrorMessage(response.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open);
    setDrawerHeight("55%");
  };

  const formatTimeToAMPM = (time) => {
    try {
      const parsedDate = parse(time, "HH:mm", new Date());
      return format(parsedDate, "hh:mma").replace(" ", "");
    } catch (error) {
      console.error("Invalid time format", error);
      return time; // Return original time if parsing fails
    }
  };

  const Puller = () => (
    <Box
      sx={{
        width: 30,
        height: 6,
        backgroundColor: "#CED3D8",
        borderRadius: 3,
        position: "absolute",
        top: 8,
        left: "calc(50% - 15px)",
      }}
    />
  );
  const handlePdfDownload = () => {
    saveAs(data.pdf, "sample.pdf");
    // fetch(data.pdf)
    //   .then((response) => response.blob())
    //   .then((blob) => {
    //     // Create a blob URL
    //     const blobUrl = URL.createObjectURL(blob);

    //     // Create a temporary anchor element
    //     const link = document.createElement("a");
    //     link.href = blobUrl;
    //     link.download = "sample.pdf";

    //     // Append to the document, click it, and remove it
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);

    //     // Clean up the blob URL
    //     URL.revokeObjectURL(blobUrl);
    //   })
    //   .catch((error) => console.error("Error downloading the PDF:", error));
  };

  const calculateTimeDifference = (inTime, outTime) => {
    const inDateTime = parse(inTime, "HH:mm", new Date());
    const outDateTime = parse(outTime, "HH:mm", new Date());

    const diffInMinutes = differenceInMinutes(outDateTime, inDateTime);
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    const hourText = hours === 1 ? "hour" : "hours";
    const minText = minutes === 1 ? "min" : "mins";

    // Only include hours and minutes if they're not zero
    const hourPart = hours > 0 ? `${hours} ${hourText}` : "";
    const minPart = minutes > 0 ? `${minutes} ${minText}` : "";

    // Add space between hours and minutes if both exist
    const separator = hours > 0 && minutes > 0 ? " " : "";

    return `${hourPart}${separator}${minPart}`;
  };

  return (
    <>
      <CustomModal
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Want to Cancel this Trip ?"
        description="Are you sure, you want to cancel this generated trip?"
        primaryButtonText="Yes, Proceed"
        primaryButtonColor="primary"
        onPrimaryAction={() => {
          dispatch(setEmptyGeneratedTrip());
          navigate("/home");
        }}
      />
      <div className="h-[calc(100vh-58px)] overflow-auto relative">
        {loading ? (
          <div className="h-full w-full flex justify-center items-center flex-col">
            <LoaderCircle
              className="animate-spin ml-1.5 mt-[1px]"
              size={50}
              color={"#ED5722"}
              strokeWidth={3}
            />
            <p className="text-black1 font-medium text-opacity-80 mt-2 text-center">
              We are generating your trip, please wait...
            </p>
          </div>
        ) : tripFailed ? (
          <div className="h-full w-full flex justify-center items-center flex-col">
            <p className="font-semibold text-lg mb-2 text-center">
              {errorMessage || contentData?.tripNotGenerated || ""}
            </p>
            <button
              className="text-white inline-flex gap-1 px-2 py-1.5 justify-center items-center bg-orange1 rounded-md"
              onClick={() => {
                dispatch(setEmptyGeneratedTrip());
                navigate("/home");
              }}
            >
              <Home className="h-5 w-5 stroke-[2px]" /> Go Home
            </button>
          </div>
        ) : (
          <>
            <iframe
              srcDoc={data.map}
              className="h-full w-full border-none"
              title="HTML Content"
            />

            <div
              className="absolute bottom-10 left-0 bg-orange1 rounded-r-lg w-40 h-16 drop-shadow inline-flex justify-between items-center px-2 cursor-pointer"
              onClick={toggleDrawer(true)}
            >
              <span className="inline-flex items-center text-xs text-white underline font-semibold">
                View Timeline <TitledArrow className="ml-1 h-2 w-2" />
              </span>
              <div className="bg-white h-10 w-10 rounded-xl inline-flex justify-center items-center border border-[#CED3D8]">
                <ViewTimelineIcon />
              </div>
            </div>

            <SwipeableDrawer
              anchor="bottom"
              open={isDrawerOpen}
              onClose={toggleDrawer(false)}
              onOpen={toggleDrawer(true)}
              swipeAreaWidth={0}
              disableSwipeToOpen={true}
              hideBackdrop={true}
              PaperProps={{
                sx: {
                  height: `${drawerHeight} !important`,
                  borderTopLeftRadius: "36px",
                  borderTopRightRadius: "36px",
                  boxShadow: "rgba(0, 0, 0, 0.4) 0px -2px 10px 0px !important",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: -10,
                    left: 0,
                    right: 0,
                    height: "10px",
                    boxShadow: "rgba(0, 0, 0, 0.1) 0px -4px 16px 0px",
                    borderRadius: "50%",
                  },
                },
                elevation: 0,
              }}
            >
              {drawerHeight === "55%" && (
                <div
                  className="absolute transform -translate-x-1/2 bg-orange1 h-8 w-8 flex items-center justify-center rounded-full shadow-md cursor-pointer animate-bounce"
                  onClick={() => setDrawerHeight("90%")}
                  style={{ top: -40, left: "calc(50% - 15px)" }}
                >
                  <ArrowUp className="h-5 w-5 text-white transform" />
                </div>
              )}
              <Puller />
              <Box
                sx={{
                  pt: 3,
                  height: "100%",
                  overflow: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Add your timeline content here */}
                <div className="flex w-full justify-between items-center border-b border-[#B3B8D6] pb-2 px-4">
                  <h2 className="text-lg font-bold text-orange1 tracking-wide">
                    View Timeline
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsDialogOpen(true)}
                      className="bg-gray-300 font-semibold text-sm px-3 py-1 rounded-md outline-none"
                    >
                      Cancel Trip
                    </button>
                    <CircleX
                      size={30}
                      strokeWidth={1}
                      className="gtclose-button text-black1 cursor-pointer"
                      onClick={() => setIsDrawerOpen(false)}
                    />
                  </div>
                </div>
                <div className="px-4 w-full bg-black1 py-2 flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <CircularAudioPlayer audioUrl={data?.audio} />
                    <div className="flex flex-col text-white text-[14px] tracking-wide">
                      <span>
                        Total Duration:{" "}
                        <strong>
                          {data?.totalDurationHours}:{data?.totalDurationMin}{" "}
                          Hours
                        </strong>
                      </span>
                      <span>
                        Number of Locations:{" "}
                        <strong>{data?.locationDetails?.length || ""}</strong>
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handlePdfDownload}
                    className="flex items-center gap-1 py-1 px-2 bg-orange1 text-[11px] font-semibold rounded-md text-white"
                  >
                    <FileDown />
                    <div className="flex flex-col">
                      <span>Download</span>
                      <span className="-mt-0.5">PDF</span>
                    </div>
                  </button>
                </div>
                <div className="px-4">
                  {Object.keys(data).length &&
                    data?.locationDetails?.map((obj, idx) => (
                      <div className="pl-2 flex items-start gap-6 relative">
                        <div className="absolute top-0 bottom-0 bg-[#518EFF] max-w-5 w-5 bg-opacity-10">
                          <div className="flex flex-col items-center mt-2 relative">
                            <PinIcon />
                            <PinBaseIcon />
                            <span className="absolute inline-flex w-full justify-center font-bold text-white text-[15px] top-[2px]">
                              {idx + 1}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 ml-10 flex flex-col gap-1.5 border-b border-dashed border-[#B3B8D6] py-3">
                          <div className="flex items-start justify-between">
                            <span className="flex-1 capitalize font-bold text-black1">
                              {idx === 0
                                ? "Pickup from "
                                : data?.locationDetails?.length - 1 === idx
                                ? "Drop to "
                                : ""}
                              {obj?.title}
                            </span>
                            <div className="flex flex-col gap-1">
                              <span className="text-[11px] text-black1 text-opacity-60 font-semibold mt-1">
                                {formatTimeToAMPM(obj?.inTime) +
                                  " - " +
                                  formatTimeToAMPM(obj?.outTime)}
                              </span>
                            </div>
                          </div>
                          <TruncatedDescription
                            description={obj.desc}
                            open={isDrawerOpen}
                          />
                          <div className="flex gap-1.5 items-center">
                            <PersonIcon />
                            <span className="text-black1 text-opacity-60 font-medium text-[11px]">
                              {calculateTimeDifference(
                                obj?.inTime,
                                obj?.outTime
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </Box>
            </SwipeableDrawer>
          </>
        )}
      </div>
    </>
  );
};

export default TripGenerate;
