import React from "react";
import {
  BrowserRouter,
  Routes as MainRoutes,
  Route,
  useLocation,
} from "react-router-dom";
import SplashScreen from "./pages/SplashScreen";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import Header from "./components/Header";

const Routes = () => {
  const location = useLocation();
  const excludedPaths = ["/", "/onboarding"];

  return (
    <>
      <div className="min-h-screen bg-gray-200">
        <div
          className="mx-auto bg-white min-h-screen flex flex-col"
          style={{ maxWidth: "430px" }}
        >
          {!excludedPaths.includes(location.pathname) && <Header />}
          <MainRoutes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/home" element={<Home />} />
          </MainRoutes>
        </div>
      </div>
    </>
  );
};

export default function RoutesWrapper() {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
}
