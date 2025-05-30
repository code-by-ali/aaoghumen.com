import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FallbackImage from "../../assets/images/fallback-slider-image.png";
import { ReactComponent as TourGuideIcon } from "../../assets/tour-guide-icon.svg";
import { ReactComponent as RideServiceIcon } from "../../assets/ride-service-icon.svg";
import {
  Checkbox,
  createTheme,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  styled,
  ThemeProvider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  setActiveTab,
  setDropLocation,
  setEmptyCart,
  setGeneratedTripFromCart,
  setTripRemove,
} from "../../redux/trip/tripSlice";
import { CustomModal } from "../../components/CustomModal";
import { Home, MapPlus, Trash2 } from "lucide-react";

const StyledFormControl = styled(FormControl)({
  "& .MuiInputLabel-root": {
    fontFamily: "Public Sans, serif", // Replace with your desired font
    fontSize: "14px",
  },
  "& .MuiSelect-select": {
    fontFamily: "Public Sans, serif",
    fontSize: "14px",
    padding: "10px 14px",
  },
  "& .MuiMenuItem-root": {
    fontFamily: "Public Sans, serif",
    "& fieldset": {
      borderColor: "#ED5722", // matching your border color from above
    },
  },
});

const StyledMenuItem = styled(MenuItem)({
  fontFamily: "Public Sans, serif",
});

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedFilters } = useSelector((state) => state.filter);
  const { contentData } = useSelector((state) => state.content);
  const { byPass } = contentData;
  const { cart } = useSelector((state) => state.trip);
  const { selectedTrips, selectedCategory, dropLocation, selectedTime } = cart;
  const dropLocations = selectedTrips.length
    ? selectedCategory === "preTrip"
      ? [
          selectedFilters["Current Location"],
          ...selectedTrips[0].tripLocation.map((obj) => ({
            name: obj.locationName,
            code: obj.locationCode,
          })),
        ]
      : [
          selectedFilters["Current Location"],
          ...selectedTrips.map((obj) => ({
            name: obj.name,
            code: obj.code,
          })),
        ]
    : [];
  const [selectedDrop, setSelectedDrop] = useState(dropLocations[0]);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isBackDialogOpen, setIsBackDialogOpen] = useState(false);
  const [confirmBack, setConfirmBack] = useState(false);
  const [amount, setAmount] = useState(byPass ? 0 : contentData?.mapTripAmount);

  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault();
      if (selectedCategory === "preTrip") {
        setIsBackDialogOpen(true);
      }
    };

    if (selectedTrips.length > 0) {
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", handleBackButton);
    }

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [selectedTrips]);

  useEffect(() => {
    if (confirmBack) {
      handleRemoveAll("preTrip");
    }
  }, [confirmBack, dispatch, navigate]);

  useEffect(() => {
    dispatch(setDropLocation(selectedDrop.code));
  }, [selectedDrop]);

  const handleDropChange = (event) => {
    // Find the complete location object that matches the selected code
    const selectedLocation = dropLocations.find(
      (location) => location.code === event.target.value
    );
    setSelectedDrop(selectedLocation);
  };

  const handleRemoveAll = (redirectTab) => {
    dispatch(setEmptyCart());
    dispatch(setDropLocation(""));
    dispatch(setActiveTab(redirectTab));
    navigate("/home");
  };

  function redirectToMobilePage() {
    const mobile = localStorage.getItem("verified-mobile");
    if (mobile) {
      if (byPass) {
        handleRedirect();
      } else {
        navigate("/payment", { state: { amount } });
      }
    } else {
      navigate("/enter-mobile", { state: { amount } });
    }
  }

  function handleRedirect() {
    var locations;
    if (selectedCategory === "preTrip") {
      if (selectedTrips.length) {
        locations = selectedTrips[0].tripLocation.map(
          (obj) => obj.locationCode
        );
      }
    } else {
      locations = selectedTrips?.map((obj) => obj.code);
    }
    dispatch(
      setGeneratedTripFromCart({
        selectedTrips: locations,
        dropLocation,
        paymentId: "",
        selectedTime,
      })
    );
    dispatch(setEmptyCart());
    navigate("/trip-generate");
  }

  return (
    <>
      <CustomModal
        open={isRemoveDialogOpen}
        onClose={() => setIsRemoveDialogOpen(false)}
        title="Remove Selected Trip"
        description="Are you sure you want to remove this trip from your cart?"
        primaryButtonText="Remove"
        primaryButtonColor="error"
        onPrimaryAction={() => handleRemoveAll("preTrip")}
      />

      <CustomModal
        open={isBackDialogOpen}
        onClose={() => setIsBackDialogOpen(false)}
        title="Discard Progress?"
        description="Your current progress will be lost. Are you sure you want to go back?"
        primaryButtonText="Yes, Discard"
        primaryButtonColor="error"
        onPrimaryAction={() => setConfirmBack(true)}
      />

      {selectedTrips.length ? (
        <div className="h-[calc(100vh-58px)] w-full flex flex-col">
          <div className="px-4 py-3 bg-black1 text-white font-semibold">
            <div className="flex items-center text-[13px] gap-2 mb-1">
              <div className="whitespace-nowrap">Selected Pickup Location</div>
              <div className="min-w-1 min-h-1 bg-white rounded-full"></div>
              <div
                className="truncate"
                title={selectedFilters["Current Location"]?.name || ""}
              >
                {selectedFilters["Current Location"]?.name || ""}
              </div>
            </div>
            <div className="flex items-center text-[13px] gap-2">
              <div>Selected Traveling Time</div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div>{selectedFilters["Traveling Time"]?.name || ""}</div>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {selectedCategory === "preTrip" ? (
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[17px] text-black1">
                    {selectedTrips[0].tripName || ""}
                  </span>
                  <span
                    className="underline text-sm underline-offset-2 text-black1 font-semibold text-opacity-70 cursor-pointer"
                    onClick={() => setIsRemoveDialogOpen(true)}
                  >
                    Remove
                  </span>
                </div>
                {selectedTrips.map((trip) =>
                  trip.tripLocation.map((location) => (
                    <div className="flex items-center gap-3 border-b border-[#B3B8D6] py-3">
                      <img
                        className="w-9 h-9 rounded-md"
                        src={
                          location.images.length
                            ? location.images[0]
                            : FallbackImage
                        }
                        alt=""
                        onError={(e) => {
                          e.target.src = FallbackImage;
                        }}
                      />
                      <p className="font-bold tracking-wide text-base">
                        {location.locationName}
                      </p>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div>
                <div className="flex justify-end items-center">
                  <span
                    className="underline text-sm underline-offset-2 text-black1 font-semibold text-opacity-70 cursor-pointer"
                    onClick={() => setIsRemoveDialogOpen(true)}
                  >
                    Remove All
                  </span>
                </div>
                {selectedTrips.map((trip) => (
                  <div
                    key={trip.code}
                    className="flex items-center justify-between w-full gap-3 border-b border-[#B3B8D6] py-3 px-2"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        className="w-9 h-9 rounded-md"
                        src={trip.image.length ? trip.image[0] : FallbackImage}
                        alt=""
                        onError={(e) => {
                          e.target.src = FallbackImage;
                        }}
                      />
                      <p className="font-bold tracking-wide text-base">
                        {trip.name}
                      </p>
                    </div>
                    <IconButton
                      aria-label="delete"
                      color="error"
                      size="small"
                      onClick={() => {
                        dispatch(setTripRemove(trip.code));
                        if (selectedDrop.code === trip.code) {
                          setSelectedDrop(dropLocations[0]);
                        }
                      }}
                    >
                      <Trash2 className="h-5 w-5" />
                    </IconButton>
                  </div>
                ))}
              </div>
            )}
            <div className="py-5">
              <StyledFormControl fullWidth size="medium">
                {" "}
                {/* Added size="small" */}
                <InputLabel id="dropoff-location">Drop off Location</InputLabel>
                <Select
                  labelId="dropoff-location"
                  id="dropoff-location-select"
                  value={selectedDrop?.code}
                  label="Drop off Location"
                  onChange={handleDropChange}
                >
                  {dropLocations.map((loc) => (
                    <StyledMenuItem key={loc.code} value={loc.code}>
                      {loc?.name}
                    </StyledMenuItem>
                  ))}
                </Select>
              </StyledFormControl>
            </div>
            <div>
              <p className="font-bold text-black1 text-xl mb-2">
                Explore Our Top Services
              </p>
              <div className="opacity-60 pointer-events-none">
                <div className="py-4 px-1 flex items-center gap-3 border-b border-[#B3B8D6]">
                  <FormControlLabel
                    control={
                      <Checkbox
                        defaultChecked
                        color="primary"
                        sx={{
                          padding: "0px 2px",
                          marginLeft: 0,
                          "& .MuiSvgIcon-root": { fontSize: "24px" },
                          "&.Mui-checked": { color: "#ED5722" },
                        }}
                      />
                    }
                    sx={{
                      "& .MuiTypography-root": {
                        fontFamily: "Public Sans, serif !important",
                        fontSize: "14px",
                        color: "#182138",
                      },
                      marginLeft: 0,
                      marginRight: 0,
                    }}
                  />
                  <MapPlus color="#182138" size={30} strokeWidth="1px" />
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold text-black1">
                      Trip with Map
                    </span>
                    <span className="font-bold text-orange1">
                      Cost:
                      <span className={`ml-1 ${byPass ? "line-through" : ""}`}>
                        ₹{contentData?.mapTripAmount || 0}
                      </span>{" "}
                      <span
                        className={`ml-1 ${byPass ? "inline-flex" : "hidden"}`}
                      >
                        ₹0
                      </span>
                    </span>
                  </div>
                </div>
                <div className="py-4 px-1 flex items-center gap-3 border-b border-[#B3B8D6]">
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        sx={{
                          padding: "0px 2px",
                          marginLeft: 0,
                          "& .MuiSvgIcon-root": { fontSize: "24px" },
                          "&.Mui-checked": { color: "#ED5722" },
                        }}
                      />
                    }
                    sx={{
                      "& .MuiTypography-root": {
                        fontFamily: "Public Sans, serif !important",
                        fontSize: "14px",
                        color: "#182138",
                      },
                      marginLeft: 0,
                      marginRight: 0,
                    }}
                  />
                  <RideServiceIcon />
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold text-black1">
                      Ride Service
                    </span>
                    <span className="font-bold text-orange1">
                      Cost:{" "}
                      <span className={`${byPass ? "line-through" : ""}`}>
                        ₹350
                      </span>{" "}
                      <span
                        className={`ml-1 ${byPass ? "inline-flex" : "hidden"}`}
                      >
                        ₹0
                      </span>
                    </span>
                  </div>
                </div>
                <div className="py-4 px-1 flex items-center gap-3 border-b border-[#B3B8D6]">
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        sx={{
                          padding: "0px 2px",
                          marginLeft: 0,
                          "& .MuiSvgIcon-root": { fontSize: "24px" },
                          "&.Mui-checked": { color: "#ED5722" },
                        }}
                      />
                    }
                    sx={{
                      "& .MuiTypography-root": {
                        fontFamily: "Public Sans, sans-serif !important",
                        fontSize: "14px",
                        color: "#182138",
                      },
                      marginLeft: 0,
                      marginRight: 0,
                    }}
                  />
                  <TourGuideIcon />
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold text-black1">
                      Tour Guide
                    </span>
                    <span className="font-bold text-orange1">
                      Cost:{" "}
                      <span className={`${byPass ? "line-through" : ""}`}>
                        ₹850
                      </span>{" "}
                      <span
                        className={`ml-1 ${byPass ? "inline-flex" : "hidden"}`}
                      >
                        ₹0
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-4 bg-black1 text-white flex justify-between items-center">
            <div>
              Total: <strong>₹{amount} </strong>
            </div>
            <button
              className="bg-orange1 rounded-lg font-medium px-3.5 py-2 text-sm"
              onClick={redirectToMobilePage}
            >
              Generate Trip
            </button>
          </div>
        </div>
      ) : (
        <div className="h-[300px] flex flex-col items-center justify-center w-full">
          <p className="font-semibold text-lg mb-2">
            Your cart is empty kindly add a trip
          </p>
          <button
            className="text-white inline-flex gap-1 px-2 py-1.5 justify-center items-center bg-orange1 rounded-md"
            onClick={() => navigate("/home")}
          >
            <Home className="h-5 w-5 stroke-[3px]" /> Go Home
          </button>
        </div>
      )}
    </>
  );
};

export default Cart;
