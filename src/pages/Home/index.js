import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FilterButton from "../../components/FilterButton";
import PlanTrip from "../../components/PlanTrip";
import PreTrip from "../../components/PreTrip";
import Spinner from "../../components/Spinner";
import TourGuide from "../../components/TourGuide";
import {
  setActiveTab,
  setPlanTrips,
  setPreTrips,
} from "../../redux/trip/tripSlice";
import apiService from "../../services/api/apiServices";
import { LoaderCircle } from "lucide-react";

const Home = () => {
  const { activeTab } = useSelector((state) => state.trip);
  const { preTrips, planTrips } = useSelector((state) => state.trip);
  const { city } = useSelector((state) => state.onboarding);
  const { selectedFilters, categories } = useSelector((state) => state.filter);
  const { contentData } = useSelector((state) => state.content);

  // Separate loading states
  const [preTripLoading, setPreTripLoading] = useState(false);
  const [planTripLoading, setPlanTripLoading] = useState(false);
  const [preTripError, setPreTripError] = useState(null);
  const [planTripError, setPlanTripError] = useState(null);
  // Local state for filtered pre-trips
  const [filteredPreTrips, setFilteredPreTrips] = useState(preTrips);

  const dispatch = useDispatch();

  const defaultPlaces = categories.map((obj) => obj.code)?.join(",");

  // Fetch PreTrip data (only once)
  const fetchPreTripData = async () => {
    if (preTrips.length > 0) return; // Don't fetch if already loaded

    const preTripBody = {
      cityName: city.cityName,
      category: "Mix1",
      language: selectedFilters.Languages.code,
      hours: String(selectedFilters["Traveling Time"].code),
      currentTimeMin: String(8 * 60),
      currentLocation: selectedFilters["Current Location"].code,
    };

    setPreTripLoading(true);
    setPreTripError(null);

    try {
      const preTripsResponse = await apiService.getPreTrips(preTripBody);
      dispatch(setPreTrips(preTripsResponse || []));
    } catch (err) {
      setPreTripError("Failed to fetch Pre Trips. Please try again.");
    } finally {
      setPreTripLoading(false);
    }
  };

  // Fetch PlanTrip data (every time filters change)
  const fetchPlanTripData = async () => {
    const planTripBody = {
      cityName: city.cityName,
      category: selectedFilters.Places.length
        ? selectedFilters.Places.map((obj) => obj.code)?.join(",")
        : defaultPlaces,
      language: selectedFilters.Languages.code,
    };

    setPlanTripLoading(true);
    setPlanTripError(null);

    try {
      const planTripsResponse = await apiService.getPlanTrips(planTripBody);
      dispatch(setPlanTrips(planTripsResponse || []));
    } catch (err) {
      setPlanTripError("Failed to fetch Plan Trips. Please try again.");
    } finally {
      setPlanTripLoading(false);
    }
  };

  // Filter preTrips locally without modifying Redux state
  function fetchPreTripLocal() {
    const currentLocation = selectedFilters["Current Location"].code;
    const hours = String(selectedFilters["Traveling Time"].code);

    // Filter preTrips based on startLocation and tripDuration
    const filtered = preTrips.filter((trip) => {
      return (
        trip.startLocation === currentLocation &&
        String(trip.tripDuration) === hours
      );
    });

    // Update local state with filtered data
    setFilteredPreTrips(filtered);
  }

  useEffect(() => {
    fetchPreTripData();
  }, []);

  useEffect(() => {
    fetchPlanTripData();
    fetchPreTripLocal();
  }, [selectedFilters]);

  // Update filteredPreTrips when preTrips changes (e.g., after initial fetch)
  useEffect(() => {
    // setFilteredPreTrips(preTrips);
    fetchPreTripLocal();
  }, [preTrips]);

  const renderPreTrip = () => {
    if (preTripLoading) {
      return (
        <div className="h-full w-full flex justify-center items-center">
          <div className="flex flex-col items-center justify-center">
            <LoaderCircle
              className="animate-spin ml-1.5 mt-[1px]"
              size={40}
              color={"#ED5722"}
              strokeWidth={3}
            />
            <span className="mt-1">Please wait while trips are loading!</span>
          </div>
        </div>
      );
    }

    if (preTripError) {
      return (
        <>
          <div className="p-3 text-red-500">{preTripError}</div>
          <FilterButton />
        </>
      );
    }

    if (filteredPreTrips.length === 0) {
      return (
        <>
          <div className="p-3">No Pre Trip data available</div>
          <FilterButton />
        </>
      );
    }

    return <PreTrip preTrips={filteredPreTrips} />;
  };

  const renderPlanTrip = () => {
    if (planTripLoading) {
      return (
        <div className="h-full w-full flex justify-center items-center">
          <LoaderCircle
            className="animate-spin ml-1.5 mt-[1px]"
            size={40}
            color={"#ED5722"}
            strokeWidth={3}
          />
        </div>
      );
    }

    if (planTripError) {
      return (
        <>
          <div className="p-3 text-red-500">{planTripError}</div>
          <FilterButton />
        </>
      );
    }

    if (planTrips.length === 0) {
      return (
        <>
          <div className="p-3">No Plan Trip data available</div>
          <FilterButton />
        </>
      );
    }

    return <PlanTrip />;
  };

  return (
    <div>
      {preTrips.length > 0 && <TourGuide />}
      <div className="flex px-3 py-4 capitalize">
        <button
          onClick={() => dispatch(setActiveTab("preTrip"))}
          className={`flex-1 py-1.5 text-center text-[15px] font-semibold ${
            activeTab === "preTrip"
              ? "bg-orange1 text-white rounded-md"
              : "text-black1"
          }`}
        >
          {contentData?.preTripPlan || ""}
        </button>
        <button
          onClick={() => dispatch(setActiveTab("planTrip"))}
          className={`plan-trip-tab flex-1 py-1.5 text-center text-[15px] font-semibold ${
            activeTab === "planTrip"
              ? "bg-orange1 text-white rounded-md"
              : "text-black1"
          }`}
        >
          {contentData?.planYourTrip || ""}
        </button>
      </div>
      <hr color="#B3B8D6" />
      <div className="h-[calc(100vh-184px)] overflow-auto relative">
        {activeTab === "preTrip" && renderPreTrip()}
        {activeTab === "planTrip" && renderPlanTrip()}
      </div>
    </div>
  );
};

export default Home;
