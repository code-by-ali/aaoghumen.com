import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  BrowserRouter,
  Routes as MainRoutes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import SplashScreen from "./pages/SplashScreen";

const Routes = () => {
  const location = useLocation();
  const excludedPaths = ["/", "/onboarding"];
  const onboarding = useSelector((state) => state.onboarding);
  const navigate = useNavigate();
  useEffect(() => {
    if (!onboarding.city && onboarding.step === 0) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="min-h-screen bg-gray-200">
        <div
          className="relative mx-auto bg-white min-h-screen flex flex-col"
          style={{ maxWidth: "430px" }}
        >
          {!excludedPaths.includes(location.pathname) && <Header />}
          <MainRoutes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/home" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
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
