interface NextsaveButtonsProps {
  outlinedButtonLabel?:string;
  nextButtonLabel?:string;
  handleNext: React.MouseEventHandler<HTMLInputElement>;
  hasConditionToSubmit?: boolean;
  canSubmit?: boolean;
  handleLeftButton: () => void;
}

const NextsaveButtons = ({outlinedButtonLabel = "Save for Later", handleLeftButton, nextButtonLabel = "Next", handleNext, hasConditionToSubmit = false, canSubmit = true}:NextsaveButtonsProps) => {
  return (
    <div className="flex flex-row mt-16">
      <button type="button" className="usa-button usa-button--outline" onClick={handleLeftButton}>
        {outlinedButtonLabel}
      </button>
      <input disabled={hasConditionToSubmit ? !canSubmit : false} 
        type="submit" className="usa-button" value={nextButtonLabel} 
        onClick={handleNext} style={{backgroundColor: canSubmit ? "#00A91C" : ""}}/>
    </div>
  );
};

export default NextsaveButtons;
