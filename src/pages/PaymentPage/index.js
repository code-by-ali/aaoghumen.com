import { LoaderCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiService from "../../services/api/apiServices";
import { useLocation, useNavigate } from "react-router-dom";
import { load } from "@cashfreepayments/cashfree-js";
import { useDispatch, useSelector } from "react-redux";
import {
  setEmptyCart,
  setGeneratedTripFromCart,
} from "../../redux/trip/tripSlice";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const phone = localStorage.getItem("verified-mobile");
  const { contentData } = useSelector((state) => state.content);
  const isCashfree = contentData.cashfree;
  const { selectedTrips, selectedCategory, dropLocation } = useSelector(
    (state) => state.trip.cart
  );
  const amount = location.state?.amount || 0;
  const [loading, setLoading] = useState(true);

  let cashfree;
  var initializeSDK = async function () {
    if (isCashfree) {
      cashfree = await load({ mode: contentData?.paymentMode || "sandbox" });
    }
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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const openCashfreePopup = async (paymentSessionId) => {
    let checkoutOptions = {
      paymentSessionId,
      redirectTarget: "_modal",
    };
    cashfree.checkout(checkoutOptions).then((result) => {
      handleRedirect(paymentSessionId);
    });
  };

  const openRazorpayPopup = async (orderData) => {
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    const options = {
      key: contentData.razorpayFreeKey,
      amount: amount,
      currency: orderData.currency,
      name: orderData.businessName,
      description: "Trip Booking Payment",
      order_id: orderData.rpOrderId,
      handler: async (response) => {
        handleRedirect(response.razorpay_payment_id);
      },
      prefill: {
        name: "Customer",
        contact: phone,
      },
      theme: {
        color: "#ED5722",
      },
      modal: {
        ondismiss: function () {
          navigate("/payment-failed");
        },
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handleCreateOrder = async () => {
    setLoading(true);
    try {
      if (isCashfree) {
        const response = await apiService.createOrder({
          mobile: phone,
          amount: String(amount),
          returnUrl: "https://aaoghumen.com/payment-status",
        });
        if (response.statusCode === 200) {
          openCashfreePopup(response.data.paymentSessionId);
        } else {
          toast.error("Failed to open payment page");
        }
      } else {
        // Razorpay order creation
        const response = await apiService.createOrder({
          mobile: phone,
          amount: String(amount),
          returnUrl: "https://aaoghumen.com/payment-status",
        });

        if (response.statusCode === 200) {
          openRazorpayPopup(response.data);
        } else {
          toast.error("Failed to create Razorpay order");
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  function handleRedirect(paymentId) {
    var locations;
    if (selectedCategory === "preTrip") {
      if (selectedTrips.length) {
        locations = selectedTrips[0].tripLocation.map(
          (obj) => obj.locationCode
        );
      }
    } else {
      locations = selectedTrips?.map((obj) => obj.code);
    }
    dispatch(
      setGeneratedTripFromCart({
        selectedTrips: locations,
        dropLocation,
        paymentId,
      })
    );
    dispatch(setEmptyCart());
    navigate("/trip-generate");
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
