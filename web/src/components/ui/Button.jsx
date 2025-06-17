import React from "react";
import Loader from "./Loader";

const Button = ({
  additionalClasses = "",
  type = "button",
  id = "",
  leadingIcon = null,
  trailingIcon = null,
  text = null,
  onClickHandler = null,
  isDisabled,
  isLoading,
  children,
  props,
}) => {
  const baseButtonStyles = "btn flexbox gap-2";
  const disabledStyles = "opacity-50 cursor-not-allowed";
  const loadingStyles =
    "relative text-transparent transition-none hover:text-transparent";

  const buttonClasses = [
    baseButtonStyles,
    isDisabled || isLoading ? disabledStyles : "",
    isLoading ? loadingStyles : "",
    additionalClasses,
  ].join(" ");

  return (
    <button
      id={id}
      className={buttonClasses}
      type={type}
      onClick={onClickHandler}
      disabled={isDisabled || isLoading}
      {...props}
    >
      {leadingIcon && (
        <span className="inlinebox">
          <i className={leadingIcon}></i>
        </span>
      )}
      {children}
      {text}
      {trailingIcon && (
        <span className="inlinebox">
          <i className={trailingIcon}></i>
        </span>
      )}
      {isLoading && <Loader />}
    </button>
  );
};

export default Button;
