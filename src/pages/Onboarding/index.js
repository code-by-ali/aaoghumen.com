import React, { useEffect, useState } from "react";
import CitySelection from "../../components/CitySelection";
import Marquee from "../../components/Marquee";
import { useDispatch, useSelector } from "react-redux";
import LanguageSelection from "../../components/LanguageSelection";
import TimeSelection from "../../components/TimeSelection";
import PickPointSelection from "../../components/PickPointSelection";
import { useNavigate } from "react-router-dom";
import apiService from "../../services/api/apiServices";
import { setCategory } from "../../redux/onboarding/onboardingSlice";
import { setCategoryList } from "../../redux/filter/filterSlice";

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
      dispatch(setCategory(selectedCategory));
      dispatch(setCategoryList(categories));
    } catch (err) {
      console.log("Failed to fetch Categories. Please try again.");
    } finally {
      setLoading(false);
      navigate("/home");
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Marquee />
      {step === 1 && <CitySelection />}
      {step === 2 && <PickPointSelection />}
      {step === 3 && <LanguageSelection />}
      {step === 4 && <TimeSelection />}
    </div>
  );
};

export default Onboarding;
