import React from "react";
import logoImgHorizontal from "../../assets/logo/horizontal.png";
import logoImgVertical from "../../assets/logo/vertical.png";

export const Logo = ({ size = 90, vertical = false, destination = "/" }) => {
  const logoImg = vertical ? logoImgVertical : logoImgHorizontal;
  return (
    <a href={destination} className="grid place-items-center h-full">
      <img
        src={logoImg}
        alt="Logo"
        className="object-center object-contain inline-block"
        style={{ width: size }}
      />
    </a>
  );
};
