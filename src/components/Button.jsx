// Button.jsx  <-- fijate que el archivo se llame exactamente Button.jsx
import React from "react";

const Button = ({ text, type = "button", onClick }) => {
  return (
    <button className="btn" type={type} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
