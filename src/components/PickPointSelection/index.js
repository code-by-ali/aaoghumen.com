import { ArrowLeft, LoaderCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as PickPointIcon } from "../../assets/pick-point-icon.svg";
import { ReactComponent as SearchIcon } from "../../assets/search-icon.svg";
import {
  setPickPointList,
  setSelectedFilters,
} from "../../redux/filter/filterSlice";
import { setPickPoint, setStep } from "../../redux/onboarding/onboardingSlice";
import apiService from "../../services/api/apiServices";

const PickPointSelection = () => {
  const { pickPoint, city, step } = useSelector((state) => state.onboarding);
  const { contentData } = useSelector((state) => state.content);
  const { selectedFilters } = useSelector((state) => state.filter);
  const [allPickPoint, setAllPickPoint] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPickPoint, setSelectedPickPoint] = useState(pickPoint);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPickPoint = async () => {
      setLoading(true);
      setError(null);
      const body = {
        cityName: city.cityName,
      };
      try {
        const response = await apiService.getPickPoints(body);
        const pickPoint = response || [];
        const allSubOptions = pickPoint.reduce((acc, item) => {
          if (Array.isArray(item.subOptions)) {
            acc.push(...item.subOptions);
          }
          return acc;
        }, []);
        setAllPickPoint(allSubOptions);
        dispatch(setPickPointList(allSubOptions));
      } catch (err) {
        setError("Failed to fetch Pick Points. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPickPoint();
  }, []);

  const filteredPickPoint = allPickPoint.filter((pickPoint) =>
    pickPoint.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedPickPoint = showAll
    ? filteredPickPoint
    : filteredPickPoint.slice(0, 10);
  const remainingCount = filteredPickPoint.length - 10;

  const handlePickPointSelect = (pickPoint) => {
    setSelectedPickPoint(pickPoint);
    const selectFiltersObject = {
      ...selectedFilters,
      "Current Location": pickPoint,
    };
    dispatch(setSelectedFilters(selectFiltersObject));
    dispatch(setPickPoint(pickPoint));
    setTimeout(() => {
      dispatch(setStep(3));
    }, 500);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="h-full w-full flex justify-center items-center">
          <LoaderCircle
            className="animate-spin ml-1.5 mt-[1px]"
            size={30}
            color={"#ED5722"}
            strokeWidth={3}
          />
        </div>
      );
    }

    if (error) {
      return <p className="text-center text-red-500">{error}</p>;
    }

    if (allPickPoint.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-gray-600 text-lg mb-2">No Pick Points Available</p>
          <p className="text-gray-400 text-sm">
            There are currently no pick points available in {city.cityName}.
            Please try another city.
          </p>
        </div>
      );
    }

    if (filteredPickPoint.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-gray-600 text-lg mb-2">No Results Found</p>
          <p className="text-gray-400 text-sm">
            No pick points match your search "{searchQuery}". Please try a
            different search term.
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-2.5">
        {displayedPickPoint.map((pickPoint) => (
          <div
            key={pickPoint.code}
            onClick={() => handlePickPointSelect(pickPoint)}
            className={`chips cursor-pointer ${
              selectedPickPoint?.code === pickPoint.code
                ? "text-orange1 bg-[#FFF5F1] border-orange1"
                : "text-black1 bg-white border-[#CED3D8]"
            }`}
          >
            {pickPoint.name}
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

        {showAll && filteredPickPoint.length > 10 && (
          <button
            onClick={() => setShowAll(false)}
            className="p-2 border border-[#CED3D8] rounded-lg text-orange1 text-sm font-medium hover:bg-orange-50"
          >
            Show less
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 px-4 text-orange1">
        <ArrowLeft
          className="text-gray-500"
          onClick={() => dispatch(setStep(step - 1))}
        />
        <PickPointIcon className="h-6 w-6" />
        <p className="font-bold capitalize">
          {contentData?.selectLocation || ""}
        </p>
      </div>
      <hr color="#B3B8D6" />
      <div className="mx-4 space-y-3">
        <div className="flex w-full p-2 border border-[#CED3D8] rounded-lg gap-1.5">
          <SearchIcon className="h-[22px]" />
          <input
            placeholder="Search Current Location"
            className="outline-none border-none text-black1 font-semibold text-[15px] selection:bg-orange1 selection:text-white w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default PickPointSelection;
