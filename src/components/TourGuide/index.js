import React, { useState, useEffect } from "react";
import Joyride from "react-joyride";
import CustomTooltip from "./CustomTooltip";
import { useSelector } from "react-redux";

const TourGuide = () => {
  const [run, setRun] = useState(false);
  const [tourCompleted, setTourCompleted] = useState(false);
  const { contentData } = useSelector((state) => state.content);

  useEffect(() => {
    // Check if user has already completed the tour
    const tourStatus = localStorage.getItem("home-tour-completed");
    if (!tourStatus) {
      setRun(true);
    }
  }, []);

  const getContent = (content) => {
    return content || "";
  };

  const steps = [
    {
      target: ".time-selection",
      title: getContent(contentData?.appTourTimeTitle),
      content: getContent(contentData?.appTourTimeDesc),
      disableBeacon: true,
    },
    {
      target: ".plan-trip-tab",
      title: getContent(contentData?.appTourPlanTripTitle),
      content: getContent(contentData?.appTourPlanTripDesc),
    },
    {
      target: ".PrivateSwipeArea-root", // Add this class to the content area of PreTrip or PlanTrip
      title: getContent(contentData?.appTourTripDetailTitle),
      content: getContent(contentData?.appTourTripDetailDesc),
    },
    {
      target: ".filter-button", // Ensure you add this class to your FilterButton component
      title: getContent(contentData?.appTourFilterTitle),
      content: getContent(contentData?.appTourFilterDesc),
    },
  ];

  const handleJoyrideCallback = (data) => {
    const { status } = data;

    if (status === "finished" || status === "skipped") {
      // Mark tour as completed in localStorage
      localStorage.setItem("home-tour-completed", "true");
      setRun(false);
      setTourCompleted(true);
    }
  };

  // If tour is already completed, don't render
  if (tourCompleted) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      callback={handleJoyrideCallback}
      tooltipComponent={CustomTooltip}
      styles={{
        options: {
          zIndex: 10000,
          fontFamily: '"Public Sans", serif',
        },
      }}
      locale={{
        last: "Finish",
        skip: "Skip Tour",
      }}
    />
  );
};

export default TourGuide;
