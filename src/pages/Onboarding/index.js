import { LoaderCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CitySelection from "../../components/CitySelection";
import LanguageSelection from "../../components/LanguageSelection";
import Marquee from "../../components/Marquee";
import PickPointSelection from "../../components/PickPointSelection";
import TimeSelection from "../../components/TimeSelection";
import { setCategoryList } from "../../redux/filter/filterSlice";
import { setCategory } from "../../redux/onboarding/onboardingSlice";
import apiService from "../../services/api/apiServices";

const Onboarding = () => {
  const { step, city, language } = useSelector((state) => state.onboarding);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (step === 5) {
      fetchCategories();
    }
  }, [step]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const body = {
        cityName: city.cityName,
        language: language.code,
      };
      const response = await apiService.getCategories(body);
      const categories = response || [];
      const selectedCategory = categories.length ? categories[0] : {};
      const transformedObject = Object.entries(categories)
        .filter(([key]) => key !== "preDefineTripsCategory")
        .map(([, value]) => value);
      dispatch(setCategory(selectedCategory));
      dispatch(setCategoryList(transformedObject));
    } catch (err) {
      console.log("Failed to fetch Categories. Please try again.");
    } finally {
      setLoading(false);
      // Store current timestamp in localStorage
      localStorage.setItem("lastFetchTime", new Date().toISOString());
      navigate("/home");
    }
  };

  return (
    <div className="flex flex-col w-full">
      {loading ? (
        <div className="h-screen flex items-center justify-center">
          <LoaderCircle
            className="animate-spin ml-1.5 mt-[1px]"
            size={40}
            color={"#ED5722"}
            strokeWidth={3}
          />
        </div>
      ) : (
        step !== 5 && (
          <>
            <Marquee />
            {step === 1 && <CitySelection />}
            {step === 2 && <PickPointSelection />}
            {step === 3 && <LanguageSelection />}
            {step === 4 && <TimeSelection />}
          </>
        )
      )}
    </div>
  );
};

export default Onboarding;
