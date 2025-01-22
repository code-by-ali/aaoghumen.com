import React from "react";
import "./Spinner.scss";

const Spinner = ({ size = "40px", color = "#ED5722", message = "" }) => {
  return (
    <div className="spinner-wrapper">
      <div
        className="spinner"
        style={{
          width: size,
          height: size,
          borderColor: `${color} transparent ${color} transparent`,
        }}
      ></div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
};

export default Spinner;
