import React from "react";

const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white rounded-md shadow-xs border border-light_bg ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
