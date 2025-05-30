import { LoaderCircle, Phone } from "lucide-react";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiService from "./../../services/api/apiServices";
import { toast } from "react-toastify";
import {
  setEmptyCart,
  setGeneratedTripFromCart,
} from "../../redux/trip/tripSlice";
import { useDispatch, useSelector } from "react-redux";

const MobileNumberInput = () => {
  const [phone, setPhone] = useState("");
  const dispatch = useDispatch();
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const amount = location.state?.amount || 0;
  const { contentData } = useSelector((state) => state.content);
  const { cart } = useSelector((state) => state.trip);
  const { selectedTrips, selectedCategory, dropLocation } = cart;
  const { byPass } = contentData;

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Allow only digits
    setPhone(value.slice(0, 10)); // Restrict to 10 digits
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitLoading(true);
    const body = {
      mobile: String(phone),
    };
    try {
      if (byPass) {
        handleRedirect();
      } else {
        const response = await apiService.getMobileOtp(body);
        if (response?.otp) {
          toast.success(response.message);
          navigate("/verify-code", {
            state: { phone, otp: response?.otp, amount },
          });
        } else {
          toast.error("OTP is not sending, Please try again.");
        }
      }
    } catch (err) {
      toast.error("Please try again later");
    } finally {
      setSubmitLoading(false);
    }
  }

  function handleRedirect() {
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
        paymentId: "",
      })
    );
    dispatch(setEmptyCart());
    localStorage.setItem("verified-mobile", phone);
    navigate("/trip-generate");
  }

  return (
    <div className="p-4">
      <p className="text-black1 font-extrabold text-2xl">Enter Mobile Number</p>
      <p className="text-sm mt-1 text-black1 text-opacity-60">
        Keep your phone handy—we'll send you a verification code via text.
      </p>

      <form className="mt-10" onSubmit={handleSubmit}>
        {/* Phone Number Input with +91 Prefix */}
        <label className="block text-black1 text-[15px] font-medium mb-1">
          Phone Number
        </label>
        <div className="flex items-center border rounded-xl p-2 bg-white">
          <span className="text-black1 text-opacity-60 font-bold">+91</span>
          <input
            type="text"
            value={phone}
            onChange={handlePhoneChange}
            className="ml-1 flex-1 p-1 font-bold text-black1 outline-none"
            placeholder="Enter 10-digit phone number"
            maxLength="10"
            required
          />
          <Phone color="#ED5722" size={20} />
        </div>

        {/* Terms & Conditions Checkbox */}
        <div className="flex items-start mt-4">
          <input
            type="checkbox"
            id="termsCheckbox"
            className="mr-3 min-h-[18px] min-w-[18px] accent-orange1 outline-none"
            required
          />
          <label
            htmlFor="termsCheckbox"
            className="text-sm text-opacity-60 text-black1"
          >
            By using this app, you agree to our{" "}
            <strong className="text-orange1">Terms and Conditions</strong> and{" "}
            <strong className="text-orange1">Privacy Policy</strong>.
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={phone.length !== 10 || submitLoading}
          className="mt-4 w-full bg-orange1 font-semibold text-white py-2 rounded-md disabled:bg-black1 disabled:bg-opacity-50 inline-flex justify-center"
        >
          Submit
          {submitLoading && (
            <LoaderCircle
              className="animate-spin ml-1.5 mt-0.5"
              size={18}
              strokeWidth={3}
            />
          )}
        </button>
      </form>
    </div>
  );
};

export default MobileNumberInput;
