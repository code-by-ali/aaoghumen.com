import React, { useEffect } from "react";
import CitySelection from "../../components/CitySelection";
import Marquee from "../../components/Marquee";
import { useSelector } from "react-redux";
import LanguageSelection from "../../components/LanguageSelection";
import TimeSelection from "../../components/TimeSelection";
import PickPointSelection from "../../components/PickPointSelection";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const { step } = useSelector((state) => state.onboarding);
  const navigate = useNavigate();

  useEffect(() => {
    if (step === 5) {
      navigate("/home");
    }
  }, [step]);

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
