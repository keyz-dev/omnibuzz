import React from "react";
import { Button } from "../ui";

const StepNavButtons = ({ onBack, onContinue, canContinue, isLoading }) => {
  return (
    <div className="flex justify-between gap-3 sm:gap-[30%] mt-8 w-full">
      <Button
        type="button"
        id="back-btn"
        additionalClasses="w-full border border-line_clr text-secondary"
        onClickHandler={onBack}
      >
        Back
      </Button>

      <Button
        type="submit"
        id="continue-btn"
        additionalClasses="w-full primarybtn"
        onClickHandler={onContinue}
        disabled={!canContinue}
      >
        Continue
      </Button>
    </div>
  );
};

export default StepNavButtons;
