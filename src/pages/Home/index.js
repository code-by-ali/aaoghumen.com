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
  const [loading, setLoading] = useState(false);
  const [preTripError, setPreTripError] = useState(null);
  const [planTripError, setPlanTripError] = useState(null);
  const dispatch = useDispatch();

  const defaultPlaces = categories.map((obj) => obj.code)?.join(",");

  const fetchData = async () => {
    const preTripBody = {
      cityName: city.cityName,
      category: "Mix1",
      language: selectedFilters.Languages.code,
      hours: String(selectedFilters["Traveling Time"].code),
      currentTimeMin: String(8 * 60),
      currentLocation: selectedFilters["Current Location"].code,
    };
    const planTripBody = {
      cityName: city.cityName,
      // category: "Temples",
      category: selectedFilters.Places.length
        ? selectedFilters.Places.map((obj) => obj.code)?.join(",")
        : defaultPlaces,
      language: selectedFilters.Languages.code,
    };
    setLoading(true);
    try {
      const preTripsResponse = await apiService.getPreTrips(preTripBody);
      dispatch(setPreTrips(preTripsResponse || []));
    } catch (err) {
      setPreTripError("Failed to fetch Pre Trips. Please try again.");
    }

    try {
      const planTripsResponse = await apiService.getPlanTrips(planTripBody);
      dispatch(setPlanTrips(planTripsResponse || []));
    } catch (err) {
      setPlanTripError("Failed to fetch Plan Trips. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedFilters]);

  const renderPreTrip = () => {
    if (loading)
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
    if (preTrips.length === 0)
      return (
        <>
          <div className="p-3">No Pre Trip data available</div>
          <FilterButton />
        </>
      );
    return <PreTrip />;
  };

  const renderPlanTrip = () => {
    if (loading)
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
    if (planTrips.length === 0)
      return (
        <>
          <div className="p-3">No Plan Trip data available</div>
          <FilterButton />
        </>
      );
    return <PlanTrip />;
  };

  return (
    <div>
      <TourGuide />
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
      <div className="h-[calc(100vh-126px)] overflow-auto relative">
        {activeTab === "preTrip" && renderPreTrip()}
        {activeTab === "planTrip" && renderPlanTrip()}
      </div>
    </div>
  );
};

export default Home;
