import React from "react";
import logoImg from "../../assets/logo/horizontal.png";
import logoImgVertical from "../../assets/logo/vertical.png";

export const Logo = () => {
  return (
    <a href="/" className="inline items-center justify-center">
      <img
        src={logoImg}
        alt="CNN Logo"
        className="size-[90px] object-center object-contain"
      />
    </a>
  );
};

export const LogoVertical = () => {
  return (
    <a href="/" className="inline items-center justify-center">
      <img
        src={logoImgVertical}
        alt="CNN Logo"
        className="size-[90px] object-center object-contain"
      />
    </a>
  );
};
