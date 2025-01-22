import React, { useEffect } from "react";
import { ReactComponent as EarthImage } from "../../assets/Earth.svg";
import { ReactComponent as SplashLogo } from "../../assets/SplashLogo.svg";
import { ReactComponent as SplashMap } from "../../assets/SplashMap.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setStep } from "../../redux/onboarding/onboardingSlice";

const SplashScreen = () => {
  const navigate = useNavigate();
  const { step } = useSelector((state) => state.onboarding);
  const dispatch = useDispatch();

  useEffect(() => {
    if (step === 0) {
      setTimeout(() => {
        dispatch(setStep(1));
        navigate("/onboarding");
      }, 3000);
    } else {
      navigate("/onboarding");
    }
  }, []);

  return step === 0 ? (
    <div className="bg-[#FF561B] min-h-screen items-center flex flex-col justify-between pb-5">
      <EarthImage className="w-full" />
      <SplashLogo />
      <SplashMap className="w-full" />
    </div>
  ) : (
    <></>
  );
};

export default SplashScreen;
