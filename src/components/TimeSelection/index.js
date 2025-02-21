import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as TimeIcon } from "../../assets/time-icon.svg";
import { ReactComponent as SearchIcon } from "../../assets/search-icon.svg";
import { setStep, setTime } from "../../redux/onboarding/onboardingSlice";
import apiService from "../../services/api/apiServices";
import Spinner from "../Spinner";
import {
  setHourList,
  setSelectedFilters,
} from "../../redux/filter/filterSlice";
import { ArrowLeft, LoaderCircle } from "lucide-react";

const TimeSelection = () => {
  const { time, step } = useSelector((state) => state.onboarding);
  const { contentData } = useSelector((state) => state.content);
  const { selectedFilters } = useSelector((state) => state.filter);
  const [allHours, setAllHours] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHour, setSelectedHour] = useState(time);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchHours = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.getHours();
        const hours = response || [];
        setAllHours(hours);
        dispatch(setHourList(hours));
      } catch (err) {
        setError("Failed to fetch Hours. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHours();
  }, []);

  const filteredHours = allHours.filter((hour) =>
    hour.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedHours = showAll ? filteredHours : filteredHours.slice(0, 10);
  const remainingCount = filteredHours.length - 10;

  const handleHourSelect = (hour) => {
    setSelectedHour(hour);
    const selectFiltersObject = {
      ...selectedFilters,
      "Traveling Time": hour,
    };
    dispatch(setSelectedFilters(selectFiltersObject));
    dispatch(setTime(hour));
    setTimeout(() => {
      dispatch(setStep(5));
    }, 500);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 px-4 text-orange1">
        <ArrowLeft
          className="text-gray-500"
          onClick={() => dispatch(setStep(step - 1))}
        />
        <TimeIcon className="h-6 w-6" />
        <p className="font-bold capitalize">{contentData?.selectTime || ""}</p>
      </div>
      <hr color="#B3B8D6" />
      <div className="mx-4 space-y-3">
        <div className="flex w-full p-2 border border-[#CED3D8] rounded-lg gap-1.5">
          <SearchIcon className="h-[22px]" />
          <input
            placeholder="Search Hours"
            className="outline-none border-none text-black1 font-semibold text-[15px] selection:bg-orange1 selection:text-white w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Display loading state */}
        {loading && (
          <div className="h-full w-full flex justify-center items-center">
            <LoaderCircle
              className="animate-spin ml-1.5 mt-[1px]"
              size={30}
              color={"#ED5722"}
              strokeWidth={3}
            />
          </div>
        )}

        {/* Display error state */}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="flex flex-wrap gap-2.5">
          {displayedHours.map((hour) => (
            <div
              key={hour.code}
              onClick={() => handleHourSelect(hour)}
              className={`chips cursor-pointer ${
                selectedHour?.code === hour.code
                  ? "text-orange1 bg-[#FFF5F1] border-orange1"
                  : "text-black1 bg-white border-[#CED3D8]"
              }`}
            >
              {hour.name}
            </div>
          ))}

          {!showAll && remainingCount > 0 && (
            <button
              onClick={() => setShowAll(true)}
              className="p-2 border border-[#CED3D8] rounded-lg text-orange1 text-sm font-medium hover:bg-orange-50"
            >
              +{remainingCount} more
            </button>
          )}

          {showAll && filteredHours.length > 10 && (
            <button
              onClick={() => setShowAll(false)}
              className="p-2 border border-[#CED3D8] rounded-lg text-orange1 text-sm font-medium hover:bg-orange-50"
            >
              Show less
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeSelection;
