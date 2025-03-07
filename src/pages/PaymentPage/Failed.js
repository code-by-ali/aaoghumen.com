import { XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Failed = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/home"); // Replace with your actual route
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleBackButton = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBackButton);
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  return (
    <div className="h-screen w-full flex items-center justify-center flex-col gap-2 p-4">
      <XCircle size={50} color="#ef4444" />
      <p className="text-2xl font-extrabold text-black1">Payment Failed!</p>
      <p className="text-black1 font-medium text-opacity-80 text-center">
        We couldn't process your payment. Please try again later or use a
        different payment method.
      </p>
      <div className="mt-4 text-sm text-black1 text-opacity-70 flex flex-col items-center gap-1">
        <p className="animate-pulse">Please do not refresh the page</p>
        <p>Redirecting you to Home page in {countdown}s...</p>
      </div>
    </div>
  );
};

export default Failed;
