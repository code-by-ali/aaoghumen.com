import { ArrowLeft, LoaderCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as LanguageIcon } from "../../assets/language-icon.svg";
import { ReactComponent as SearchIcon } from "../../assets/search-icon.svg";
import {
  setLanguageList,
  setSelectedFilters,
} from "../../redux/filter/filterSlice";
import { setLanguage, setStep } from "../../redux/onboarding/onboardingSlice";
import apiService from "../../services/api/apiServices";

const LanguageSelection = () => {
  const { language, step } = useSelector((state) => state.onboarding);
  const { contentData } = useSelector((state) => state.content);
  const { selectedFilters } = useSelector((state) => state.filter);
  const [allLanguages, setAllLanguages] = useState([]); // Dynamic language list
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  // Fetch cities from API
  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.getLanguages();
        // Access the cityData array from the response
        const languages = response || [];
        setAllLanguages(languages);
        dispatch(setLanguageList(languages));
      } catch (err) {
        setError("Failed to fetch Languages. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const filteredLanguages = allLanguages.filter((lang) =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Determine which languages to display
  const displayedLanguages = showAll
    ? filteredLanguages
    : filteredLanguages.slice(0, 10);
  const remainingCount = filteredLanguages.length - 10;

  // Handle language selection
  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    const selectFiltersObject = {
      ...selectedFilters,
      Languages: language,
    };
    dispatch(setSelectedFilters(selectFiltersObject));
    dispatch(setLanguage(language)); // Update Redux store
    setTimeout(() => {
      dispatch(setStep(4));
    }, 500);
  };

  return (
    <div className="flex flex-col gap-3 transition-all duration-1000 ease-in-out">
      <div className="flex items-center gap-2 px-4 text-orange1">
        <ArrowLeft
          className="text-gray-500"
          onClick={() => dispatch(setStep(step - 1))}
        />
        <LanguageIcon className="h-6 w-6" />
        <p className="font-bold capitalize">
          {contentData?.selectLanguage || ""}
        </p>
      </div>
      <hr color="#B3B8D6" />
      <div className="mx-4 space-y-3">
        <div className="flex w-full p-2 border border-[#CED3D8] rounded-lg gap-1.5">
          <SearchIcon className="h-[22px]" />
          <input
            placeholder="Search Language"
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
          {displayedLanguages.map((lang) => (
            <div
              key={lang.code}
              onClick={() => handleLanguageSelect(lang)}
              className={`chips cursor-pointer ${
                selectedLanguage?.code === lang.code
                  ? "text-orange1 bg-[#FFF5F1] border-orange1"
                  : "text-black1 bg-white border-[#CED3D8]"
              }`}
            >
              {lang.name}
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

          {showAll && filteredLanguages.length > 10 && (
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

export default LanguageSelection;
