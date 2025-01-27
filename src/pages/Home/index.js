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

const Home = () => {
  const { activeTab } = useSelector((state) => state.trip);
  const { preTrips, planTrips } = useSelector((state) => state.trip);
  const { city, language, category } = useSelector((state) => state.onboarding);
  const [loading, setLoading] = useState(false);
  const [preTripError, setPreTripError] = useState(null);
  const [planTripError, setPlanTripError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const body = {
      cityName: city.cityName,
      category: "Temples",
      language: language.code,
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        const preTripsResponse = await apiService.getPreTrips(body);
        dispatch(setPreTrips(preTripsResponse || []));
      } catch (err) {
        setPreTripError("Failed to fetch Pre Trips. Please try again.");
      }

      try {
        const planTripsResponse = await apiService.getPlanTrips(body);
        dispatch(setPlanTrips(planTripsResponse || []));
      } catch (err) {
        setPlanTripError("Failed to fetch Plan Trips. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [city.cityName, language.code, dispatch]);

  const renderPreTrip = () => {
    if (loading && preTrips.length === 0) return <Spinner />;
    if (preTrips.length === 0) return <div>No Pre Trip data available</div>;
    return <PreTrip />;
  };

  const renderPlanTrip = () => {
    if (loading && planTrips.length === 0) return <Spinner />;
    if (planTrips.length === 0) return <div>No Plan Trip data available</div>;
    return <PlanTrip />;
  };

  return (
    <div>
      <div className="flex px-3 py-4">
        <button
          onClick={() => dispatch(setActiveTab("preTrip"))}
          className={`flex-1 py-1.5 text-center text-[15px] font-semibold ${
            activeTab === "preTrip"
              ? "bg-orange1 text-white rounded-md"
              : "text-black1"
          }`}
        >
          Pre Trip Plan
        </button>
        <button
          onClick={() => dispatch(setActiveTab("planTrip"))}
          className={`flex-1 py-1.5 text-center text-[15px] font-semibold ${
            activeTab === "planTrip"
              ? "bg-orange1 text-white rounded-md"
              : "text-black1"
          }`}
        >
          Plan Your Trip
        </button>
      </div>
      <hr color="#B3B8D6" />
      {activeTab === "preTrip" && renderPreTrip()}
      {activeTab === "planTrip" && renderPlanTrip()}
    </div>
  );
};

export default Home;
