import React from "react";
import { BrowserRouter, Routes as MainRoutes, Route } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";

const Routes = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-200">
        <div
          className="mx-auto bg-white min-h-screen flex flex-col"
          style={{ maxWidth: "430px" }}
        >
          <MainRoutes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/home" element={<Home />} />
          </MainRoutes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default Routes;
