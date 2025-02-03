import React, { useEffect, useState } from "react";
import { ReactComponent as EarthImage } from "../../assets/Earth.svg";
import { ReactComponent as SplashLogo } from "../../assets/SplashLogo.svg";
import { ReactComponent as SplashMap } from "../../assets/SplashMap.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setStep } from "../../redux/onboarding/onboardingSlice";
import { Loader2 } from "lucide-react";
import apiService from "../../services/api/apiServices";
import { setContent } from "../../redux/content/contentSlice";

const SplashScreen = () => {
  const navigate = useNavigate();
  const { step } = useSelector((state) => state.onboarding);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [apiCompleted, setApiCompleted] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);

  useEffect(() => {
    let timer;

    const fetchData = async () => {
      try {
        // Replace with your actual API call
        const response = await apiService.getStaticContent();
        dispatch(setContent(response));
        // Handle the data as needed
        setApiCompleted(true);
      } catch (error) {
        console.error("API Error:", error);
        // Handle error appropriately
        setApiCompleted(true); // Still set to true to allow navigation
      }
    };

    if (step === 0) {
      // Start API call
      fetchData();

      // Start 3 second timer
      timer = setTimeout(() => {
        setTimerCompleted(true);
      }, 3000);

      // Show loader if API takes more than 3 seconds
      const loaderTimer = setTimeout(() => {
        if (!apiCompleted) {
          setIsLoading(true);
        }
      }, 3000);

      return () => {
        clearTimeout(timer);
        clearTimeout(loaderTimer);
      };
    } else {
      navigate("/onboarding");
    }
  }, []);

  // Effect to handle navigation when both API and timer are complete
  useEffect(() => {
    if (apiCompleted && timerCompleted) {
      dispatch(setStep(1));
      navigate("/onboarding");
    }
  }, [apiCompleted, timerCompleted]);

  if (step !== 0) return null;

  return (
    <div className="bg-[#FF561B] min-h-screen items-center flex flex-col justify-between pb-5 relative">
      <EarthImage className="w-full" />
      <SplashLogo />
      <SplashMap className="w-full" />

      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SplashScreen;
