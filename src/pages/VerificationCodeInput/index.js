import { LoaderCircle, Pencil } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiService from "../../services/api/apiServices";
import { toast } from "react-toastify";

const OTP_TIMER = 120; // Timer duration in seconds (2 minutes)

const VerificationCodeInput = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]); // Now handling 6 digits
  const [timeLeft, setTimeLeft] = useState(OTP_TIMER);
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const inputRefs = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];
  const location = useLocation();
  const navigate = useNavigate();
  const phone = location.state?.phone || "N/A";
  var otp = location.state?.otp || "";
  var amount = location.state?.amount || 0;

  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Handle OTP Input Change
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  // Handle Backspace Key Navigation
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  // Handle OTP Paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newCode[index] = char;
    });
    setCode(newCode);

    const lastIndex = Math.min(pastedData.length - 1, 5);
    inputRefs[lastIndex].current?.focus();
  };

  // Handle OTP Submission
  async function handleSubmit() {
    if (code.join("").length === 6) {
      console.log("Submitted code:", code.join(""));
      if (code.join("") === otp) {
        localStorage.setItem("verified-mobile", phone);
        toast.success("OTP is successfully verified");
        navigate("/payment", { state: { amount } });
      } else {
        toast.error("OTP is incorrect");
      }
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    setResendLoading(true);
    const body = {
      mobile: String(phone),
      otp: String(otp),
    };
    try {
      const response = await apiService.getResendOtp(body);
      if (response?.otp) {
        otp = response.otp;
        toast.success(response.message);
        setTimeLeft(OTP_TIMER);
        setCanResend(false);
      } else {
        toast.error("OTP is not sending, Please try again.");
      }
    } catch (err) {
      toast.error("Please try again later");
    } finally {
      setResendLoading(false);
    }
  };

  // Format Time in mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  return (
    <div className="p-4">
      <p className="text-black1 font-extrabold text-2xl">
        Verification 6 Digit Code
      </p>
      <p className="text-sm mt-1 text-black1">
        A verification code has been sent to your mobile number{" "}
        <strong className="text-opacity-100">(+91) {phone}</strong>
        <span
          className="text-orange1 inline-flex text-opacity-100 gap-1 ml-2 items-center underline-offset-2 underline cursor-pointer"
          onClick={() => navigate("/enter-mobile")}
        >
          <Pencil color="#ED5722" size={14} />
          Edit
        </span>
      </p>

      {/* OTP Input Fields */}
      <div className="flex justify-between gap-3 mb-6 mt-10">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={inputRefs[index]}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-full h-12 text-center text-2xl font-bold border rounded-lg focus:border-orange1 focus:ring-1 focus:ring-orange1 outline-none drop-shadow"
          />
        ))}
      </div>

      {/* Submit Button */}
      <button
        className={`w-full py-2 px-4 inline-flex justify-center rounded-lg transition-colors font-semibold ${
          code.join("").length === 6
            ? "bg-orange1 text-white"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
        onClick={handleSubmit}
        disabled={code.join("").length !== 6 || submitLoading}
      >
        Submit{" "}
        {submitLoading && (
          <LoaderCircle
            className="animate-spin ml-1.5 mt-[1px]"
            size={20}
            strokeWidth={3}
          />
        )}
      </button>

      {/* Resend OTP Button & Timer */}
      <div className="text-center mt-4 text-[15px]">
        {resendLoading ? (
          <p className="text-gray-500 underline underline-offset-2 inline-flex gap-2">
            Resend OTP{" "}
            <LoaderCircle className="animate-spin" size={20} color="#ED5722" />
          </p>
        ) : canResend ? (
          <button
            className="text-orange1 underline underline-offset-2 font-semibold"
            onClick={handleResendOTP}
          >
            Resend OTP
          </button>
        ) : (
          <p className="text-gray-500 underline underline-offset-2">
            Resend OTP in {formatTime(timeLeft)}
          </p>
        )}
      </div>
    </div>
  );
};

export default VerificationCodeInput;
