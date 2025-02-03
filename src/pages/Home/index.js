import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveTab,
  setPlanTrips,
  setPreTrips,
} from "../../redux/trip/tripSlice";
import apiService from "../../services/api/apiServices";
import PreTrip from "../../components/PreTrip";
import PlanTrip from "../../components/PlanTrip";
import Spinner from "../../components/Spinner";
import { getHours } from "date-fns";
import FilterButton from "../../components/FilterButton";

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
      category: "Temples",
      // selectedFilters.Places.length
      //   ? selectedFilters.Places.map((obj) => obj.code)?.join(",")
      //   : defaultPlaces,
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
    if (loading) return <Spinner />;
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
    if (loading) return <Spinner />;
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
          className={`flex-1 py-1.5 text-center text-[15px] font-semibold ${
            activeTab === "planTrip"
              ? "bg-orange1 text-white rounded-md"
              : "text-black1"
          }`}
        >
          {contentData?.planYourTrip || ""}
        </button>
      </div>
      <hr color="#B3B8D6" />
      {activeTab === "preTrip" && renderPreTrip()}
      {activeTab === "planTrip" && renderPlanTrip()}
    </div>
  );
};

export default Home;
