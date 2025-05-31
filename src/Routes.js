import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  BrowserRouter,
  Routes as MainRoutes,
  Navigate,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import MobileNumberInput from "./pages/MobileNumberInput";
import Onboarding from "./pages/Onboarding";
import PaymentPage from "./pages/PaymentPage";
import Failed from "./pages/PaymentPage/Failed";
import Status from "./pages/PaymentPage/Status";
import Success from "./pages/PaymentPage/Success";
import SplashScreen from "./pages/SplashScreen";
import TripGenerate from "./pages/TripGenerate";
import VerificationCodeInput from "./pages/VerificationCodeInput";

const Routes = () => {
  const location = useLocation();
  const excludedPaths = [
    "/",
    "/onboarding",
    "/payment",
    "/payment-success",
    "/payment-failed",
  ];
  const onboarding = useSelector((state) => state.onboarding);
  const navigate = useNavigate();

  useEffect(() => {
    if (!onboarding.city && onboarding.step === 0) {
      navigate("/");
    }
  }, [navigate, onboarding.city, onboarding.step]);

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
            <Route path="/enter-mobile" element={<MobileNumberInput />} />
            <Route path="/verify-code" element={<VerificationCodeInput />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payment-success" element={<Success />} />
            <Route path="/payment-failed" element={<Failed />} />
            <Route path="/trip-generate" element={<TripGenerate />} />
            <Route path="/payment-status" element={<Status />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
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
