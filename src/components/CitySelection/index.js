import React, { useState, useEffect } from "react";
import { ReactComponent as GlobeIconOrange } from "../../assets/globe-icon-orange.svg";
import { ReactComponent as SearchIcon } from "../../assets/search-icon.svg";
import Temple1 from "../../assets/images/temple-1.png";
import apiService from "../../services/api/apiServices";
import { useDispatch, useSelector } from "react-redux";
import { setCity, setStep } from "../../redux/onboarding/onboardingSlice";
import Spinner from "../Spinner";

const CitySelection = () => {
  const { city } = useSelector((state) => state.onboarding);
  const { contentData } = useSelector((state) => state.content);
  const [allCities, setAllCities] = useState([]); // Dynamic cities list
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState(city);

  const dispatch = useDispatch();

  // Fetch cities from API
  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.getCity();
        // Access the cityData array from the response
        const cities = response[0]?.cityData || [];
        setAllCities(cities);
      } catch (err) {
        setError("Failed to fetch cities. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  // Modify the filter function to use cityName
  const filteredCities = allCities.filter((city) =>
    city.cityName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // Determine which cities to display
  const displayedCities = showAll
    ? filteredCities
    : filteredCities.slice(0, 10);
  const remainingCount = filteredCities.length - 10;

  function handleSelectedCity(city) {
    setSelectedCity(city);
    dispatch(setCity(city));
    setTimeout(() => {
      dispatch(setStep(2));
    }, 500);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 px-4 text-orange1">
        <GlobeIconOrange />
        <p className="font-bold capitalize">{contentData?.selectCity || ""}</p>
      </div>
      <hr color="#B3B8D6" />
      <div className="mx-4 space-y-3">
        <div className="flex w-full p-2 border border-[#CED3D8] rounded-lg gap-1.5">
          <SearchIcon className="h-[22px]" />
          <input
            placeholder="Search Current City"
            className="outline-none border-none text-black1 font-semibold text-[15px] selection:bg-orange1 selection:text-white w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Display loading state */}
        {loading && <Spinner message="Loading, please wait..." />}

        {/* Display error state */}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="flex flex-wrap gap-2.5">
          {displayedCities.map((city, index) => (
            <div
              onClick={() => handleSelectedCity(city)}
              key={city.cityId}
              className={`chips ${
                selectedCity.cityName === city.cityName
                  ? "text-orange1 bg-[#FFF5F1] border-orange1"
                  : " text-black1 bg-white border-[#CED3D8]"
              }  ${
                city.cityStatus
                  ? "pointer-events-auto"
                  : "pointer-events-none cursor-not-allowed opacity-50"
              }`}
            >
              <img
                alt={city.cityName}
                src={city.imgPath}
                className="rounded-full h-5 w-5"
                onError={(e) => {
                  e.target.src = Temple1; // Fallback to Temple1 if image fails to load
                }}
              />
              {city.cityName}
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

          {showAll && filteredCities.length > 10 && (
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

export default CitySelection;
