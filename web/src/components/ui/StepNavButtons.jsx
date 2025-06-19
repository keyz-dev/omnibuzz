import React from "react";
import { Button } from ".";

const StepNavButtons = ({
  onBack = null,
  onContinue = null,
  canContinue,
  isLoading,
  onBackText,
  onContinueText,
}) => {
  return (
    <div
      className={`flex ${
        onBack ? "justify-center" : "justify-end"
      } gap-3 sm:gap-[30%] mt-8 w-full`}
    >
      {onBack && (
        <Button
          type="button"
          id="back-btn"
          additionalClasses="w-full border border-line_clr text-secondary"
          onClickHandler={onBack}
        >
          {onBackText || "Back"}
        </Button>
      )}

      <Button
        type="submit"
        id="continue-btn"
        additionalClasses="w-full primarybtn"
        onClickHandler={onContinue}
        isDisabled={isLoading || !canContinue}
      >
        {onContinueText || "Continue"}
      </Button>
    </div>
  );
};

export default StepNavButtons;
