import React from "react";
import { X } from "lucide-react"; // Assuming you're using lucide-react for icons

const CustomTooltip = ({
  step,
  tooltipProps,
  closeProps,
  primaryProps,
  skipProps,
  backProps,
  isLastStep,
}) => {
  return (
    <div
      {...tooltipProps}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
      style={{
        fontFamily: '"Public Sans", serif',
        width: "90%",
        maxWidth: "400px",
        minWidth: "300px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-3 py-2 border-b border-gray-200">
        <h2 className="text-[17px] font-semibold text-orange1">
          {step.title || "Tour Guide"}
        </h2>
        <button
          {...closeProps}
          className="text-orange1 hover:bg-gray-100 rounded-full p-1"
        >
          <X size={20} strokeWidth={3} />
        </button>
      </div>

      {/* Content */}
      <div className="px-3 py-3 font-medium text-sm text-black1 text-opacity-70">
        {step.content}
      </div>

      {/* Footer */}
      <div className="flex justify-between px-3 py-2.5 border-t border-gray-200">
        {!isLastStep && (
          <button
            {...skipProps}
            className="text-orange1 hover:bg-gray-100 px-4 py-1 rounded-md"
          >
            Skip
          </button>
        )}

        <div className="flex-grow"></div>

        <div className="flex space-x-2">
          {!step.disableBeacon && (
            <button
              {...backProps}
              className="text-orange1 hover:bg-gray-100 px-4 py-1 rounded-md"
            >
              Back
            </button>
          )}

          <button
            {...primaryProps}
            className="bg-orange1 text-white font-semibold text-[15px] px-4 rounded-md py-1 hover:bg-orange-600"
          >
            {isLastStep ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomTooltip;
