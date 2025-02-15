import { LoaderCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiService from "../../services/api/apiServices";
import { useLocation, useNavigate } from "react-router-dom";
import { load } from "@cashfreepayments/cashfree-js";
import { useDispatch, useSelector } from "react-redux";
import { setEmptyCart, setGeneratedTripFromCart } from "../../redux/trip/tripSlice";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const phone = localStorage.getItem("verified-mobile");
  const { contentData } = useSelector((state) => state.content);
  const { selectedTrips, selectedCategory, dropLocation } = useSelector((state) => state.trip.cart);
  const amount = location.state?.amount || 0;
  const [loading, setLoading] = useState(true);
  let cashfree;

  var initializeSDK = async function () {
    cashfree = await load({ mode: contentData?.paymentMode || "sandbox" });
  };
  initializeSDK();

  useEffect(() => {
    // Disable back button
    const handleBackButton = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBackButton);

    handleCreateOrder();

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  const openCashfreePopup = async (paymentSessionId) => {
    let checkoutOptions = {
      paymentSessionId,
      redirectTarget: "_modal",
    };
    cashfree.checkout(checkoutOptions).then((result) => {
      console.log(result);
      
      if (result.error) {
        navigate("/payment-failed");
      }
      if (result.redirect) {
        console.log("Payment will be redirected");
      }
      if (result.paymentDetails) {
        handleSuccess()
      }
    });
  };

  const handleCreateOrder = async () => {
    setLoading(true);
    try {
      const response = await apiService.cashFreeCreateOrder({
        mobile: phone,
        amount: String(amount),
        returnUrl: 'https://aaoghumen.vercel.app/payment-status'
      });
      if (response.statusCode === 200) {
        openCashfreePopup(response.data.paymentSessionId);
      } else {
        toast.error("Failed to open payment page");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  function handleSuccess() {
    var locations;
    if(selectedCategory === "preTrip") {
      if(selectedTrips.length) {
        locations = selectedTrips[0].tripLocation.map(obj => obj.locationCode)
      }
    }else{
      locations = selectedTrips?.map(obj => obj.code)
    }
    dispatch(setGeneratedTripFromCart({
      selectedTrips: locations,
      dropLocation
    }))
    dispatch(setEmptyCart())
    navigate("/payment-success");
  }

  return (
    <div className="h-[calc(100vh-58px)] flex flex-col gap-2 items-center justify-center">
      <LoaderCircle className="animate-spin" color="#ED5722" size={50} />
      <span className="font-semibold text-opacity-70 text-black1">
        Redirecting you to the payment page...
      </span>
    </div>
  );
};

export default PaymentPage;
