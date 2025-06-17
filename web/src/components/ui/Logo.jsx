import React from "react";
import logoImg from "../../assets/logo/horizontal.png";
import logoImgVertical from "../../assets/logo/vertical.png";

export const Logo = ({ size = 90 }) => {
  return (
    <a href="/" className="grid place-items-center h-full">
      <img
        src={logoImg}
        alt="CNN Logo"
        className="object-center object-contain inline-block"
        style={{ width: size }}
      />
    </a>
  );
};

export const LogoVertical = ({ size = 90 }) => {
  return (
    <a href="/" className="inline items-center justify-center">
      <img
        src={logoImgVertical}
        alt="CNN Logo"
        className="object-center object-contain"
        style={{ width: size, height: size }}
      />
    </a>
  );
};
